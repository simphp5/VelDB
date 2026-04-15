# Test Results for 10 Business Queries

## Setup
Database: Mock SQLite (`veldb_test.db`) or PostgreSQL when `VELDB_PG_DSN` is set
API Endpoint: `POST /nl_to_sql`

## Schema Sources Seen
SQLite (fallback)

## Detailed Results
| Question | Expected SQL | Generated SQL | Correct? | HTTP |
| --- | --- | --- | --- | --- |

| Show all customers and their emails | `SELECT customer_id, email FROM customers;` | `SELECT customer_id, email FROM customers;` | ✅ | 200 |
| How many orders do we have pending? | `SELECT COALESCE(COUNT(*), 0) FROM orders WHERE status = 'pending';` | `SELECT COUNT(*) FROM orders WHERE status = 'pending';` | ⚠️ | 200 |
| What is the total revenue from all completed orders? | `SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'completed';` | `SELECT SUM(total_amount) FROM orders WHERE status = 'completed';` | ⚠️ | 200 |
| List all products priced above $50 | `SELECT * FROM products WHERE price > 50;` | `SELECT * FROM products WHERE price > 50;` | ✅ | 200 |
| Which customer placed the most recent order? | `SELECT c.* FROM customers c JOIN orders o ON c.customer_id = o.customer_id ORDER BY o.order_date DESC LIMIT 1;` | `SELECT c.* FROM customers c JOIN orders o ON c.customer_id = o.customer_id ORDER BY o.order_date DESC LIMIT 1;` | ✅ | 200 |
| Show all product names and their current stock quantities | `SELECT product_name, stock_quantity FROM products;` | `SELECT product_name, stock_quantity FROM products;` | ✅ | 200 |
| Find the average order value | `SELECT AVG(total_amount) FROM orders;` | `SELECT AVG(total_amount) FROM orders;` | ✅ | 200 |
| List customers who have 'example.com' emails | `SELECT customer_id, email FROM customers WHERE email LIKE '%@example.com';` | `SELECT customer_id, email FROM customers;` | ⚠️ | 200 |
| Show the highest priced product in Electronics category | `SELECT * FROM products WHERE category = 'Electronics' ORDER BY price DESC LIMIT 1;` | `SELECT * FROM products WHERE category = 'Electronics' ORDER BY price DESC LIMIT 1;` | ✅ | 200 |
| How many products are currently out of stock? | `SELECT COUNT(*) FROM products WHERE stock_quantity = 0;` | `SELECT COUNT(*) FROM products WHERE stock_quantity = 0;` | ✅ | 200 |