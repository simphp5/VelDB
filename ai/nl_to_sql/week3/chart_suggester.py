from typing import List, Any

def suggest_chart(columns: List[str], rows: List[List[Any]]) -> str:
    """
    Suggests a chart type based on the result shape and column names.
    """
    if not columns or not rows:
        return "table"
        
    num_cols = len(columns)
    num_rows = len(rows)

    # One value -> kpi_card
    if num_cols == 1 and num_rows == 1:
        return "kpi_card"
        
    cols_lower = [col.lower() for col in columns]
    
    def has_any(keywords):
        return any(any(k in c for k in keywords) for c in cols_lower)

    has_date = has_any(["date", "month", "year", "day", "time"])
    has_sales = has_any(["sale", "revenue", "value", "amount", "total", "price"])
    has_category = has_any(["category", "product", "item", "type", "status", "group"])
    has_percent = has_any(["percent", "pct", "ratio", "rate", "share"])

    # date/month + sales/revenue -> line_chart
    if has_date and has_sales:
        return "line_chart"

    # category + percentage -> pie_chart
    if has_category and has_percent:
        return "pie_chart"
        
    # product/category + sales/value -> bar_chart
    if has_category and has_sales:
        return "bar_chart"

    return "table"
