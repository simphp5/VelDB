# VelDB AI Architecture

This document outlines the pipeline flow for the VelDB AI querying system.

## Pipeline Flow

1. **User Input** 
   - The user enters a natural language query via the frontend.
   - Example: *"Show me the total sales in February."*

2. **NL to SQL Engine** (`nl_to_sql.py`)
   - The natural language query is processed alongside the database schema (provided by `schema_reader.py`).
   - The intent is extracted and converted into a standard SQL query using rule-based/prompt logic.

3. **DB Execution** 
   - The SQL query is executed directly against the local SQLite database.
   - Returns tabular row data (a list of dictionaries).

4. **Results Enhancement**
   - The row data is passed to the next two modules simultaneously to enrich the UX. 
   - **Report Generator** (`report_generator.py`): Aggregates the numeric data to produce a professional business report including title, summary, key findings, and recommendations.
   - **Insights Engine** (`insights_engine.py`): Performs lightweight statistical checks to find trends, max/min anomalies, and comparisons across the rows.

5. **Accuracy Tracker** (`accuracy_tracker.py` & `eval_suite.py`)
   - During evaluation, the generated SQL is logged.
   - The expected query vs. the generated query is scored (exact, partial, wrong) to maintain a history of the AI model's SQL translation accuracy.
