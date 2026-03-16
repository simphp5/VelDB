query = input("Ask database question: ")

if "all users" in query:
    print("SELECT * FROM users")

elif "all products" in query:
    print("SELECT * FROM products")

else:
    print("Query not understood")