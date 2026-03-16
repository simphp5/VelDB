query = input("Ask VelDB: ")

if "total users" in query:
    print("SELECT COUNT(*) FROM users")
else:
    print("Query not understood")