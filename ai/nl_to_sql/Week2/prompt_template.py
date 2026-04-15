def build_prompt(schema: str, question: str) -> str:
    """
    Builds the final prompt string that injects the exact schema and the user's natural language question.
    """
    prompt = f"""You are an expert SQL assistant working with the schema shown below.

Schema:
{schema}

Rules:
- Use only the tables and columns that are explicitly listed. Do not invent resources.
- Return exactly one SELECT statement that answers the question.
- Avoid JOINs unless the schema indicates how tables relate.
- Never provide explanations, reasoning, or additional context.
- Do not wrap the SQL in markdown or fenced code blocks.

User's Question: {question}
SQL Query:
"""
    return prompt.strip()
