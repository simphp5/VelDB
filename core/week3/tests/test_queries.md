# VelDB Test Queries - Week 3 Validation

Below are the 20 robust test queries spanning week 3 functionalities alongside the exact expected output behavior.

## UPDATE (4)
1. `UPDATE customers SET city = 'Chennai' WHERE customer_id = 1;`
   - *Expected Behavior:* Finds the record matching `1`, updates it conceptually by appending `(MODIFIED: Chennai)`, and rewrites `customers.vdb`.
2. `UPDATE products SET price = '150' WHERE product_id = 10;`
   - *Expected Behavior:* Matches product `10`, applies text tracking mappings updating specific variables flawlessly.
3. `UPDATE orders SET status = 'Shipped' WHERE status = 'Processing';`
   - *Expected Behavior:* Iterates targeting `Processing` orders, mapping string equivalents safely onto `orders.vdb`.
4. `UPDATE employees SET role = 'Manager' WHERE employee_id = 5;`
   - *Expected Behavior:* Connects mapping properties mapping string metadata tracking employee metrics reliably.

## DELETE (4)
5. `DELETE FROM customers WHERE customer_id = 3;`
   - *Expected Behavior:* Recognizes line encompassing `3`, cascades omission and natively drops file trace entirely. 
6. `DELETE FROM products WHERE stock = '0';`
   - *Expected Behavior:* Evaluates zero identifiers filtering unused properties cleaning metadata out of data sets seamlessly.
7. `DELETE FROM orders WHERE order_id = 99;`
   - *Expected Behavior:* Evaluates missing constraints ensuring index `99` skips insertion blocks flawlessly limiting overlap natively.
8. `DELETE FROM employees WHERE department = 'Sales';`
   - *Expected Behavior:* Removes textual links cascading mappings natively without rewriting matched references natively.

## JOIN (4)
9. `SELECT customers.name, orders.total FROM customers INNER JOIN orders ON customers.customer_id = orders.customer_id;`
   - *Expected Behavior:* Reads nested tables matching common intersection keys building compound string outputs formatted `row1 | row2`.
10. `SELECT products.name, inventory.stock FROM products INNER JOIN inventory ON products.id = inventory.product_id;`
   - *Expected Behavior:* Overlaps distinct text references linking dynamic foreign string layers generating relational combinations seamlessly.
11. `SELECT employees.name, departments.name FROM employees INNER JOIN departments ON employees.dept_id = departments.id;`
   - *Expected Behavior:* Safely concatenates overlapping parameters merging columns safely mimicking traditional join behavior accurately.
12. `SELECT users.email, profiles.bio FROM users INNER JOIN profiles ON users.id = profiles.user_id;`
   - *Expected Behavior:* Connects metrics generating output string arrays matching user identifiers correctly across flat files conceptually.

## ORDER BY (3)
13. `SELECT * FROM products ORDER BY price DESC;`
   - *Expected Behavior:* Lexicographically evaluates strings mapping structural reversals returning values dynamically reversed (Z-A).
14. `SELECT * FROM employees ORDER BY date_joined ASC;`
   - *Expected Behavior:* Lexicographically assesses output constraints executing ascending strings structurally parsing values linearly.
15. `SELECT * FROM orders ORDER BY total DESC;`
   - *Expected Behavior:* Parses descending characteristics yielding results scaling highest character equivalents foremost reliably.

## LIMIT (2)
16. `SELECT * FROM products LIMIT 5;`
   - *Expected Behavior:* Evaluates thresholds stopping processing loop after discovering exactly `5` rows terminating iterator appropriately.
17. `SELECT * FROM customers LIMIT 10;`
   - *Expected Behavior:* Outputs only `10` matches bypassing any trailing constraints enforcing threshold limitations dynamically.

## ORDER BY + LIMIT (2)
18. `SELECT * FROM orders ORDER BY total DESC LIMIT 3;`
   - *Expected Behavior:* Processes full array sorting strings negatively before enforcing limits cleanly pushing truncated output limits natively retaining only max `3`.
19. `SELECT * FROM top_scores ORDER BY score DESC LIMIT 1;`
   - *Expected Behavior:* Enforces ordering algorithms discovering highest match dropping components parsing specific limit size `1` properly.

## Optimizer (1)
20. `SELECT * FROM customers WHERE email = 'test@example.com';`
   - *Expected Behavior:* Terminal automatically yields debugger syntax indicating routing configuration specifically registering `DEBUG: [Optimizer] Choosing scan strategy for SELECT: FULL_SCAN`. 
