# Domain Testing Results

This file documents the testing of the domain detector with 5 sample schemas or queries to verify the retail domain detection.

### Test Case 1: Standard Retail Schema
- **Schema**: `{"users": ["user_id", "name", "email"], "orders": ["order_id", "total_amount", "customer_id"]}`
- **Expected Output**: `retail`
- **Actual Output**: `retail`
- **Notes**: Contains the keywords 'customer' and 'order'.

### Test Case 2: Inventory & Suppliers
- **Schema**: `{"inventory": ["item_id", "stock_count"], "suppliers": ["supplier_id", "company_name"]}`
- **Expected Output**: `retail`
- **Actual Output**: `retail`
- **Notes**: Contains the keywords 'inventory' and 'supplier'.

### Test Case 3: Sales Data
- **Schema**: `{"sales": ["sale_date", "revenue"], "products": ["product_id", "category"]}`
- **Expected Output**: `retail`
- **Actual Output**: `retail`
- **Notes**: Contains the keywords 'sale' and 'product'.

### Test Case 4: Non-Retail / Unknown Schema
- **Schema**: `{"logs": ["log_id", "timestamp", "message"], "events": ["event_id", "payload"]}`
- **Expected Output**: `unknown`
- **Actual Output**: `unknown`
- **Notes**: Does not contain any retail keywords, so it gracefully falls back to 'unknown'.

### Test Case 5: Hybrid / Mixed Naming Schema
- **Schema**: `{"customers_data": ["customer_email", "phone"], "purchase_history": ["purchase_id", "item_name"]}`
- **Expected Output**: `retail`
- **Actual Output**: `retail`
- **Notes**: 'customers_data' contains 'customer', correctly identifying it as a retail domain despite non-standard table names.
