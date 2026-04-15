import asyncio
import multiprocessing
import time
from typing import Dict, List, Sequence

import uvicorn
from httpx import AsyncClient

from api_server import app
from create_mock_db import create_mock_db

EXPECTED_QUERIES: Sequence[Dict[str, str]] = [
    {
        "question": "Show all customers and their emails",
        "expected": "SELECT customer_id, email FROM customers;",
    },
    {
        "question": "How many orders do we have pending?",
        "expected": "SELECT COALESCE(COUNT(*), 0) FROM orders WHERE status = 'pending';",
    },
    {
        "question": "What is the total revenue from all completed orders?",
        "expected": "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'completed';",
    },
    {
        "question": "List all products priced above $50",
        "expected": "SELECT * FROM products WHERE price > 50;",
    },
    {
        "question": "Which customer placed the most recent order?",
        "expected": "SELECT c.* FROM customers c JOIN orders o ON c.customer_id = o.customer_id ORDER BY o.order_date DESC LIMIT 1;",
    },
    {
        "question": "Show all product names and their current stock quantities",
        "expected": "SELECT product_name, stock_quantity FROM products;",
    },
    {
        "question": "Find the average order value",
        "expected": "SELECT AVG(total_amount) FROM orders;",
    },
    {
        "question": "List customers who have 'example.com' emails",
        "expected": "SELECT customer_id, email FROM customers WHERE email LIKE '%@example.com';",
    },
    {
        "question": "Show the highest priced product in Electronics category",
        "expected": "SELECT * FROM products WHERE category = 'Electronics' ORDER BY price DESC LIMIT 1;",
    },
    {
        "question": "How many products are currently out of stock?",
        "expected": "SELECT COUNT(*) FROM products WHERE stock_quantity = 0;",
    },
]

SERVER_URL = "http://127.0.0.1:8000"
TABLE_HEADER = "| Question | Expected SQL | Generated SQL | Correct? | HTTP |\n| --- | --- | --- | --- | --- |\n"


def _sanitize_for_table(value: str) -> str:
    return value.replace("\n", "<br>").replace("|", "&#124;").strip()


async def test_endpoint() -> List[Dict[str, str]]:
    results: List[Dict[str, str]] = []
    async with AsyncClient(base_url=SERVER_URL) as client:
        for sample in EXPECTED_QUERIES:
            response = await client.post("/nl_to_sql", json={"question": sample["question"]})
            generated_sql = ""
            schema_source = "unknown"

            if response.status_code == 200:
                payload = response.json()
                generated_sql = payload.get("sql", "").strip()
                schema_source = payload.get("schema_source") or schema_source

            results.append(
                {
                    "question": sample["question"],
                    "expected": sample["expected"],
                    "generated": generated_sql,
                    "correct": "✅" if generated_sql.lower() == sample["expected"].lower() else "⚠️",
                    "http": str(response.status_code),
                    "schema_source": schema_source,
                }
            )
    return results


def render_markdown(results: List[Dict[str, str]]) -> str:
    lines = [
        "# Test Results for 10 Business Queries",
        "",
        "## Setup",
        "Database: Mock SQLite (`veldb_test.db`) or PostgreSQL when `VELDB_PG_DSN` is set",
        "API Endpoint: `POST /nl_to_sql`",
        "",
        "## Schema Sources Seen",
        f"{', '.join(sorted({r['schema_source'] for r in results if r['schema_source']})) or 'Not reported'}",
        "",
        "## Detailed Results",
        TABLE_HEADER,
    ]

    for result in results:
        lines.append(
            "| "
            f"{_sanitize_for_table(result['question'])} | "
            f"`{_sanitize_for_table(result['expected'])}` | "
            f"`{_sanitize_for_table(result['generated'])}` | "
            f"{result['correct']} | "
            f"{result['http']} |"
        )

    return "\n".join(lines)


def run_server():
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="error")


if __name__ == "__main__":
    create_mock_db()

    server_process = multiprocessing.Process(target=run_server)
    server_process.start()
    time.sleep(2)  # wait for server to boot

    try:
        results = asyncio.run(test_endpoint())
        markdown = render_markdown(results)
        with open("test_results.md", "w", encoding="utf-8") as fh:
            fh.write(markdown)
        print("Tests completed successfully. Results saved to test_results.md")
    finally:
        server_process.terminate()
        server_process.join()
