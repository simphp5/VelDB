function ApiExample() {
  const examples = [
    {
      title: "Show all customers",
      query: "SELECT * FROM customers;"
    },
    {
      title: "Show all products",
      query: "SELECT * FROM products;"
    },
    {
      title: "Count pending orders",
      query: "SELECT COUNT(*) FROM orders WHERE status = 'pending';"
    },
    {
      title: "Product name & stock",
      query: "SELECT name, stock FROM products;"
    },
    {
      title: "Highest priced Electronics product",
      query: "SELECT * FROM products WHERE category = 'Electronics' ORDER BY price DESC LIMIT 1;"
    },
    {
      title: "Average order value",
      query: "SELECT AVG(total_amount) FROM orders;"
    }
  ];

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <div className="card-header">
        <span className="card-title">📘 Query Examples</span>
      </div>

      <div style={{ padding: 12 }}>
        {examples.map((ex, index) => (
          <div
            key={index}
            style={{
              marginBottom: 12,
              padding: 10,
              border: "1px solid #eee",
              borderRadius: 8
            }}
          >
            <strong>{ex.title}</strong>
            <pre
              style={{
                marginTop: 6,
                background: "#f5f5f5",
                padding: 8,
                borderRadius: 6
              }}
            >
              {ex.query}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApiExample;