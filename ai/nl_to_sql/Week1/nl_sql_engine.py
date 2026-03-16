def convert_to_sql(text):

    if "all users" in text:
        return "SELECT * FROM users"

    elif "all products" in text:
        return "SELECT * FROM products"

    elif "total orders" in text:
        return "SELECT COUNT(*) FROM orders"

    else:
        return "Query not recognized"


user_query = input("Ask VelDB: ")

sql = convert_to_sql(user_query)

print("Generated SQL:", sql)