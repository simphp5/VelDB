def detect_domain(schema: dict) -> str:
    """
    Detects the domain of a given database schema based on table and column names.
    Detects only retail domain using related keywords.
    """
    retail_keywords = ["customer", "product", "order", "sale", "inventory", "supplier"]
    
    score = 0
    
    for table_name, columns in schema.items():
        # check table name
        if any(k in table_name.lower() for k in retail_keywords):
            score += 2
        
        # check column names
        for col in columns:
            if any(k in col.lower() for k in retail_keywords):
                score += 1
                    
    if score > 0:
        return "retail"
    return "unknown"
