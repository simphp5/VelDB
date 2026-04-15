import re

def convert_nl_to_sql(query: str, schema: dict) -> str:
    """
    Converts a simple natural language query into a SQL query using basic rules.
    This simulates an LLM/prompt-based approach without using paid APIs.
    Supports basic SELECT, WHERE, COUNT, SUM.
    """
    query_lower = query.lower()
    
    # Simple rule-based translations for demonstration
    if "total sales" in query_lower or "sum of sales" in query_lower:
        return "SELECT SUM(sales) FROM sales_data;"
        
    if "count" in query_lower and "users" in query_lower:
        return "SELECT COUNT(*) FROM users;"
        
    # Check for month specific queries
    month_match = re.search(r'(in|for) (\w+)', query_lower)
    if "sales" in query_lower and month_match:
        month = month_match.group(2).capitalize()
        # Ensure month is short format if that's what schema contains, but simple cap works for demo
        return f"SELECT sales FROM sales_data WHERE month = '{month[:3]}';"

    # Fallback default query
    return "SELECT * FROM sales_data LIMIT 10;"
