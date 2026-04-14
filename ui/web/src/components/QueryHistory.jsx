function QueryHistory({ history = [], onSelect }) {
  if (!history.length) {
    return (
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-title">🕘 Query History</span>
        </div>
        <div style={{ padding: 12 }}>
          <p style={{ color: "#888" }}>No queries run yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <div className="card-header">
        <span className="card-title">🕘 Query History</span>
      </div>

      <div style={{ padding: 12 }}>
        {history.slice(0, 10).map((q, i) => (
          <div
            key={i}
            onClick={() => onSelect && onSelect(q)}
            style={{
              padding: 10,
              marginBottom: 8,
              background: "#f9f9f9",
              borderRadius: 6,
              cursor: "pointer",
              border: "1px solid #eee"
            }}
          >
            <code>{q}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QueryHistory;