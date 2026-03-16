query = input("Ask VelDB: ")

if "product price" in query:
    print("SELECT price FROM products")
else:
    print("Query not understood")