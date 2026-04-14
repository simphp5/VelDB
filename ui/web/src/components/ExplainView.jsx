export default function ExplainView({ explainResults }) {
  if (!explainResults || !explainResults.rows) return null;

  return (
    <div className="card animate-fade-in" style={{ marginTop: 16 }}>
      <div className="card-header">
        <span className="card-title">🔍 Query Execution Plan (EXPLAIN)</span>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {explainResults.columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {explainResults.rows.map((row, idx) => (
              <tr key={idx}>
                {explainResults.columns.map((col) => (
                  <td key={col}>{row[col] !== null ? String(row[col]) : "NULL"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
