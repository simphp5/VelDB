query_map = {
    "show all users": "SELECT * FROM users",
    "show all products": "SELECT * FROM products",
    "show all orders": "SELECT * FROM orders",
    "total users": "SELECT COUNT(*) FROM users"
}

query = input("Ask VelDB: ")

if query in query_map:
    print(query_map[query])
else:
    print("Query not supported")