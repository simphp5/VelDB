# VelDB Test Queries - Week 2

Below are 10 sample business queries focusing on INSERTs, specific SELECTs, and filtering (WHERE) logic.

### 1-4. Data Insertion
```sql
INSERT INTO employees VALUES (1, 'Ravi', 45000.5);
INSERT INTO employees VALUES (2, 'Sunil', 50000.0);
INSERT INTO employees VALUES (3, 'Priya', 65000.0);
INSERT INTO employees VALUES (4, 'Arun', 30000.0);
```
*(Tests type validation for INT, TEXT, FLOAT and sequentially updates the `.vdb` file + in-memory HashMap index)*

### 5. Basic Retrieval
```sql
SELECT * FROM employees;
```
*(Tests basic full table scan, and constructs ASCII output based on all schema columns)*

### 6. Column Projection
```sql
SELECT name, salary FROM employees;
```
*(Tests extract operations on specific requested columns based on their indices inside the row)*

### 7. Index-Optimized WHERE lookup (INT)
```sql
SELECT * FROM employees WHERE id = 2;
```
*(Triggers the `= ` operator optimization. Accesses the internal `IndexManager`, directly seeks to the row's file byte offset without a full scan)*

### 8. Index-Optimized WHERE lookup (TEXT)
```sql
SELECT * FROM employees WHERE name = 'Priya';
```
*(Triggers the `= ` operator optimization for strings)*

### 9. Fallback Full-Scan Filtering (Numeric Greater Than)
```sql
SELECT name FROM employees WHERE salary > 40000.0;
```
*(Filters dynamically applied on floating point data. Falls back to a full reading sweep scan since it's a range condition)*

### 10. Fallback Full-Scan Filtering (Less Than or Equal)
```sql
SELECT * FROM employees WHERE salary <= 45000.5;
```
*(Type-aware evaluation over numeric `<=` logic)*
