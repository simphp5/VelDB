from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from nl_to_sql import convert_nl_to_sql
from schema_reader import read_schema
from report_generator import generate_report
from insights_engine import generate_insights

app = FastAPI(title="VelDB AI Module API")

class NLQueryRequest(BaseModel):
    query: str

class QueryResultsRequest(BaseModel):
    results: List[Dict[str, Any]]

@app.post("/nl_to_sql")
def api_nl_to_sql(req: NLQueryRequest):
    schema = read_schema()
    sql = convert_nl_to_sql(req.query, schema)
    return {"sql_query": sql}

@app.post("/generate_report")
def api_generate_report(req: QueryResultsRequest):
    report = generate_report(req.results)
    return report

@app.post("/insights")
def api_insights(req: QueryResultsRequest):
    insights = generate_insights(req.results)
    return {"insights": insights}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
