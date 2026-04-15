import csv
import json
import os
from datetime import datetime

LOG_FILE_JSON = "evaluation_logs.json"
LOG_FILE_CSV = "evaluation_logs.csv"

def log_evaluation(nl_query: str, expected_sql: str, generated_sql: str, score: float, notes: str = ""):
    """
    Logs the evaluation entry to both JSON and CSV formats.
    Score should be a float between 0 and 1.
    """
    entry = {
        "timestamp": datetime.now().isoformat(),
        "nl_query": nl_query,
        "expected_sql": expected_sql,
        "generated_sql": generated_sql,
        "score": score,
        "notes": notes
    }
    
    # JSON Logging
    data = []
    if os.path.exists(LOG_FILE_JSON):
        with open(LOG_FILE_JSON, 'r') as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                pass
    data.append(entry)
    with open(LOG_FILE_JSON, 'w') as f:
        json.dump(data, f, indent=4)
        
    # CSV Logging
    file_exists = os.path.isfile(LOG_FILE_CSV)
    with open(LOG_FILE_CSV, 'a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=entry.keys())
        if not file_exists:
            writer.writeheader()
        writer.writerow(entry)
