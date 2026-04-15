import sqlite3
from typing import Dict, List

def read_schema(db_path: str = "veldb.sqlite") -> Dict[str, List[str]]:
    """
    Reads the schema from a given SQLite database.
    Returns a dictionary mapping table names to a list of their column names.
    If the DB does not exist, returns a dummy schema for demonstration.
    """
    schema = {}
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        for table in tables:
            table_name = table[0]
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = [col[1] for col in cursor.fetchall()]
            schema[table_name] = columns
            
        conn.close()
    except sqlite3.OperationalError:
        pass
    
    # Fallback to dummy schema if empty (student project friendly)
    if not schema:
        schema = {
            "sales_data": ["id", "month", "sales", "orders"],
            "users": ["id", "username", "email"]
        }
    return schema
