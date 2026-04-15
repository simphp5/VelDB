query = input("Ask VelDB: ")

if "monthly sales" in query:
    print("SELECT month, SUM(amount) FROM sales GROUP BY month")
else:
    print("Query not understood")