import os
import sqlite3
from typing import Sequence

try:
    import psycopg2
except ImportError:  # pragma: no cover
    psycopg2 = None

DB_PATH = os.environ.get("VELDB_SQLITE_PATH", "veldb_test.db")
PG_DSN = os.environ.get("VELDB_PG_DSN")

CUSTOMER_ROWS: Sequence[Sequence] = [
    ("Alice", "Smith", "alice@example.com"),
    ("Bob", "Johnson", "bob@example.com"),
    ("Charlie", "Brown", "charlie@example.com"),
]
PRODUCT_ROWS: Sequence[Sequence] = [
    ("Laptop Pro", "Electronics", 1200.00, 50),
    ("Wireless Mouse", "Accessories", 25.50, 200),
    ("Coffee Maker", "Home Appliances", 89.99, 30),
]
ORDER_ROWS: Sequence[Sequence] = [
    (1, 1200.00, "completed"),
    (1, 25.50, "completed"),
    (2, 89.99, "pending"),
]


def _create_sqlite_mock_db():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE customers (
            customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """
    )

    cursor.execute(
        """
        CREATE TABLE products (
            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            category TEXT,
            price DECIMAL(10, 2) NOT NULL,
            stock_quantity INTEGER DEFAULT 0
        );
        """
    )

    cursor.execute(
        """
        CREATE TABLE orders (
            order_id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            total_amount DECIMAL(10, 2),
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        );
        """
    )

    cursor.executemany(
        "INSERT INTO customers (first_name, last_name, email) VALUES (?, ?, ?);", CUSTOMER_ROWS
    )
    cursor.executemany(
        "INSERT INTO products (product_name, category, price, stock_quantity) VALUES (?, ?, ?, ?);",
        PRODUCT_ROWS,
    )
    cursor.executemany(
        "INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?);", ORDER_ROWS
    )

    conn.commit()
    conn.close()

    print(f"SQLite mock database created at {DB_PATH} with sample data.")


def _create_postgres_mock_db():
    if psycopg2 is None:
        raise RuntimeError("psycopg2-binary is required to seed PostgreSQL.")

    with psycopg2.connect(PG_DSN) as conn:
        with conn.cursor() as cursor:
            cursor.execute("DROP TABLE IF EXISTS orders;")
            cursor.execute("DROP TABLE IF EXISTS products;")
            cursor.execute("DROP TABLE IF EXISTS customers;")

            cursor.execute(
                """
                CREATE TABLE customers (
                    customer_id SERIAL PRIMARY KEY,
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    email TEXT UNIQUE,
                    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
                );
                """
            )

            cursor.execute(
                """
                CREATE TABLE products (
                    product_id SERIAL PRIMARY KEY,
                    product_name TEXT NOT NULL,
                    category TEXT,
                    price NUMERIC(10, 2) NOT NULL,
                    stock_quantity INTEGER DEFAULT 0
                );
                """
            )

            cursor.execute(
                """
                CREATE TABLE orders (
                    order_id SERIAL PRIMARY KEY,
                    customer_id INTEGER REFERENCES customers(customer_id),
                    order_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                    total_amount NUMERIC(10, 2),
                    status TEXT DEFAULT 'pending'
                );
                """
            )

            cursor.executemany(
                "INSERT INTO customers (first_name, last_name, email) VALUES (%s, %s, %s);", CUSTOMER_ROWS
            )
            cursor.executemany(
                "INSERT INTO products (product_name, category, price, stock_quantity) VALUES (%s, %s, %s, %s);",
                PRODUCT_ROWS,
            )
            cursor.executemany(
                "INSERT INTO orders (customer_id, total_amount, status) VALUES (%s, %s, %s);", ORDER_ROWS
            )
        conn.commit()

    print("PostgreSQL mock schema created using the VELDB_PG_DSN connection.")


def create_mock_db():
    if PG_DSN:
        _create_postgres_mock_db()
    else:
        _create_sqlite_mock_db()


if __name__ == "__main__":
    create_mock_db()
