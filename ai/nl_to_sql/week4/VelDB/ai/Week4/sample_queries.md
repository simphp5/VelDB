# Sample Queries for Testing

Here are some sample inputs you can use with the API.

## 1. Natural Language to SQL `/nl_to_sql`
**Input Payload:**
```json
{
  "query": "total sales"
}
```

## 2. Generate Report `/generate_report`
**Input Payload:**
```json
{
  "results": [
    {"month": "Jan", "sales": 10000, "orders": 120},
    {"month": "Feb", "sales": 15000, "orders": 145},
    {"month": "Mar", "sales": 8000, "orders": 90}
  ]
}
```

## 3. Extract Insights `/insights`
**Input Payload:**
```json
{
  "results": [
    {"month": "Jan", "sales": 10000, "orders": 120},
    {"month": "Feb", "sales": 15000, "orders": 145},
    {"month": "Mar", "sales": 8000, "orders": 90}
  ]
}
```
