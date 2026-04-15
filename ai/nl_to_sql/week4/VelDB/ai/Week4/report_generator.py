def generate_report(results: list[dict]) -> dict:
    """
    Converts SQL results into a readable business report.
    Expects tabular records (list of dictionaries).
    """
    if not results:
        return {
            "title": "Data Report",
            "summary": "No data available for the given query.",
            "key_findings": [],
            "recommendations": "Provide a different query to generate data."
        }

    # Detect numeric and string fields
    keys = list(results[0].keys())
    numeric_keys = [k for k in keys if isinstance(results[0][k], (int, float))]
    string_keys = [k for k in keys if isinstance(results[0][k], str)]
    
    title = f"Business Report: {', '.join([k.capitalize() for k in numeric_keys])} Overview"
    summary = f"This report covers data across {len(results)} records."
    
    key_findings = []
    recommendations = "Monitor the metrics closely over the next period."

    for key in numeric_keys:
        values = [row[key] for row in results if key in row and isinstance(row[key], (int, float))]
        if values:
            total = sum(values)
            max_val = max(values)
            min_val = min(values)
            
            # Contextualize with string keys if present (e.g. Month)
            max_row = next((r for r in results if r.get(key) == max_val), None)
            
            context_str = ""
            if string_keys and max_row:
                context_str = f" in {max_row[string_keys[0]]}"
                
            key_findings.append(f"Total {key}: {total}")
            key_findings.append(f"Highest {key} was {max_val}{context_str}.")
            
            if len(values) > 1:
                # Basic trend check
                if values[-1] < values[-2]:
                    recommendations = f"Look into the recent drop in {key}."
                    key_findings.append(f"Noticed a recent drop in {key}.")
                elif values[-1] > values[-2]:
                    recommendations = f"Capitalize on the recent growth in {key}."
                    key_findings.append(f"Noticed an upward trend in {key}.")

    return {
        "title": title,
        "summary": summary,
        "key_findings": set(key_findings), # use set to avoid exact duplicates
        "recommendations": recommendations
    }
