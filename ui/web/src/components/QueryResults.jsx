function QueryResults({ columns = [], rows = [] }) {
  if (!rows.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <h3>No Data</h3>
        <p>Run a query to see results here</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 50 }}>#</th>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={{ color: "var(--text-muted)" }}>{i + 1}</td>
              {columns.map((col) => (
                <td key={col}>
                  {row[col] === null ? (
                    <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>NULL</span>
                  ) : (
                    String(row[col])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QueryResults;