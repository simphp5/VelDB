# NL-to-SQL API Service

This project is a modular FastAPI service that translates natural language into SQL queries by combining:

- `schema_reader.py` – reads the live schema (PostgreSQL by default, with a SQLite fallback) and exposes both structured metadata and a formatted version for prompt injection.
- `prompt_template.py` – enforces strict instructions so the LLM only emits valid SELECT statements that respect the schema.
- `api_server.py` – orchestrates schema collection, prompt construction, LLM invocation (mock + Gemini/OpenAI hooks), and error handling via FastAPI.
- `test_queries.py` + `test_results.md` – document deterministic test runs for the core business questions.
- `create_mock_db.py` – seeds either the local SQLite file or a PostgreSQL instance, depending on whether `VELDB_PG_DSN` is set, so the stack can be exercised without external services.

## Setup & Running

1. **Install dependencies (inside `.venv` if preferred)**  
   ```bash
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install fastapi uvicorn httpx pydantic google-genai psycopg2-binary
   ```

2. **Configure the database**  
   - To point at PostgreSQL, export `VELDB_PG_DSN="postgresql://user:pass@host:port/veldb"` (or set the equivalent `PGHOST/PGUSER/PGPASSWORD/PGDATABASE/PGPORT` environment variables).  
   - Without `VELDB_PG_DSN`, the code reads/writes `veldb_test.db` via SQLite for quick local iteration.
   - Seed the schema/data by running `python create_mock_db.py`. This script will rebuild the schema in whichever database layer is active.

3. **Start the API server**  
   ```bash
   uvicorn api_server:app --reload
   ```

## Schema extraction

`SchemaReader` now returns a dictionary of `{table: {columns: [...], types: [...], details: [...]}}` plus a human-readable block for the prompt. The API surfaces the `schema_source` (“PostgreSQL” vs “SQLite (fallback)”) in each response, which helps verify you are hitting the intended database.

## Prompt rules

The prompt instructs the LLM to:

- Rely only on the schema that was injected—no guessing.
- Produce exactly one SELECT statement (no DML, no INSERT/UPDATE/DELETE).
- Omit explanations, markdown fences, or anything beyond the raw SQL.
- Prefer the schema’s JOIN paths when linking tables.

These constraints keep the generated SQL precise and predictable for downstream systems.

## Testing & Results

- Run `python test_queries.py` to replay the 10 “business questions” and update `test_results.md`. The script starts the FastAPI server, hits `/nl_to_sql`, and writes a table with the question, expected SQL, actual SQL, correctness flag, and the HTTP status.
- Review `test_results.md` to see the latest table-driven results for that test suite; it documents both the expected SQL and any divergence the mock prompt produced.

## Frontend Integration

POST to `http://127.0.0.1:8000/nl_to_sql` with:

```json
{
  "question": "Show all product names and their current stock quantities"
}
```

The service responds with the SQL string, the schema block that was used, and the schema’s provenance for auditing.
