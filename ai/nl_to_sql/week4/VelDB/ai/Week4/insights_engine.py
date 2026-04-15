def generate_insights(results: list[dict]) -> list:
    """
    Detects trends, anomalies, max/min values, and comparisons
    from the result list of dictionaries.
    """
    insights = []
    if not results:
        return insights
        
    keys = list(results[0].keys())
    numeric_keys = [k for k in keys if isinstance(results[0][k], (int, float))]
    string_keys = [k for k in keys if isinstance(results[0][k], str)]
    
    for key in numeric_keys:
        values = [(row.get(string_keys[0]) if string_keys else f"Row {i}", row[key]) 
                  for i, row in enumerate(results) if key in row and isinstance(row[key], (int, float))]
                  
        if not values:
            continue
            
        just_vals = [v[1] for v in values]
        max_val = max(just_vals)
        min_val = min(just_vals)
        
        max_label = [v[0] for v in values if v[1] == max_val][0]
        min_label = [v[0] for v in values if v[1] == min_val][0]
        
        insights.append(f"{key.capitalize()} peaked in {max_label}.")
        
        if len(just_vals) > 1:
            first_val = just_vals[0]
            last_val = just_vals[-1]
            diff = last_val - first_val
            
            if diff > 0:
                insights.append(f"Overall {key} trend is positive.")
            elif diff < 0:
                insights.append(f"Overall {key} trend in decline.")
            
            # Simple month-over-month or row-over-row check
            for i in range(1, len(just_vals)):
                prev = just_vals[i-1]
                curr = just_vals[i]
                if curr < prev:
                    insights.append(f"{key.capitalize()} dropped in {values[i][0]}.")
                    
    # Return unique insights using set
    return list(set(insights))
