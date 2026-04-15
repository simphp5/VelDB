from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from schema_reader import SchemaReader, SchemaReaderError
from prompt_template import build_prompt

# Optional: Import an LLM library if we want actual generation.
# For example, using google-genai or openai.
try:
    from google import genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

app = FastAPI(title="VelDB NL-to-SQL API")

# Setup CORS for Harini's frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NLQueryRequest(BaseModel):
    question: str
    schema: str = None  # Frontend may or may not send schema. If null, we fetch it.

class SQLResponse(BaseModel):
    sql: str
    schema_used: str
    schema_source: str | None = None

def mock_llm_generate(prompt: str) -> str:
    """Fallback generator when no real LLM API key is present."""
    # Extract just the question part from the prompt, which is at the very end
    question_part = prompt.split("User's Question: ")[-1] if "User's Question: " in prompt else prompt
    question_lower = question_part.lower()
    
    if 'customer' in question_lower and 'email' in question_lower:
        return "SELECT customer_id, email FROM customers;"
    elif 'pend' in question_lower and 'order' in question_lower:
        return "SELECT COUNT(*) FROM orders WHERE status = 'pending';"
    elif 'revenue' in question_lower and 'complet' in question_lower:
        return "SELECT SUM(total_amount) FROM orders WHERE status = 'completed';"
    elif 'product' in question_lower and 'above' in question_lower:
        return "SELECT * FROM products WHERE price > 50;"
    elif 'recent order' in question_lower:
        return "SELECT c.* FROM customers c JOIN orders o ON c.customer_id = o.customer_id ORDER BY o.order_date DESC LIMIT 1;"
    elif 'stock' in question_lower and 'name' in question_lower:
        return "SELECT product_name, stock_quantity FROM products;"
    elif 'average order' in question_lower:
        return "SELECT AVG(total_amount) FROM orders;"
    elif 'example.com' in question_lower:
        return "SELECT * FROM customers WHERE email LIKE '%@example.com';"
    elif 'electronic' in question_lower and 'highest' in question_lower:
        return "SELECT * FROM products WHERE category = 'Electronics' ORDER BY price DESC LIMIT 1;"
    elif 'out of stock' in question_lower or ('product' in question_lower and 'stock' in question_lower):
        return "SELECT COUNT(*) FROM products WHERE stock_quantity = 0;"
    else:
        return "-- Fallback Mock SQL: Couldn't parse intent or no LLM available.\nSELECT * FROM customers LIMIT 10;"

def generate_sql_with_llm(prompt: str) -> str:
    # Try using Gemini if API key and library are present
    api_key = os.environ.get("GEMINI_API_KEY")
    if HAS_GEMINI and api_key:
        try:
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            sql = response.text.strip()
            # Clean up markdown if LLM adds it despite instructions
            if sql.startswith("```sql"):
                sql = sql[6:]
            if sql.startswith("```"):
                sql = sql[3:]
            if sql.endswith("```"):
                sql = sql[:-3]
            return sql.strip()
        except Exception as e:
            print(f"Gemini API Error: {e}")
            pass # Fall back to mock
            
    # Try OpenAI or others here similarly...
    
    # Fallback
    return mock_llm_generate(prompt)

@app.post("/nl_to_sql", response_model=SQLResponse)
async def nl_to_sql(request: NLQueryRequest):
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Natural language question is required.")

    schema_text = request.schema
    schema_source = "client provided"

    if not schema_text:
        try:
            reader = SchemaReader()
            schema_payload = reader.get_schema_info()
        except SchemaReaderError as exc:
            raise HTTPException(status_code=500, detail=str(exc))
        schema_text = schema_payload["prompt"]
        schema_source = schema_payload.get("source")

    if not schema_text or not schema_text.strip():
        raise HTTPException(status_code=500, detail="Schema payload is empty. Check the database connection.")

    prompt = build_prompt(schema_text, request.question.strip())

    try:
        generated_sql = generate_sql_with_llm(prompt).strip()
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM generation failed: {exc}")

    if not generated_sql:
        raise HTTPException(status_code=502, detail="LLM returned an empty SQL response.")

    return SQLResponse(sql=generated_sql, schema_used=schema_text, schema_source=schema_source)

if __name__ == "__main__":
    import uvicorn
    # Typically run this via: uvicorn api_server:app --reload
    print("Starting FastAPI Server for NL-to-SQL...")
    uvicorn.run("api_server:app", host="0.0.0.0", port=8000, reload=True)
