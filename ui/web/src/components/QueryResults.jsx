export default function QueryResults({ columns = [], rows = [] }) {
  if (!rows.length) {
    return (
      <div style={{ padding: '60px 40px', textAlign: 'center', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📭</div>
        <h3 style={{ color: '#cccccc', margin: '0 0 8px 0', fontWeight: '500' }}>No Data Available</h3>
        <p style={{ color: '#858585', margin: 0, fontSize: '14px' }}>Run a SQL query above to see the output results here.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      overflowX: 'auto', maxHeight: '400px', backgroundColor: '#1e1e1e', borderRadius: '8px', 
      border: '1px solid #333', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
    }}>
      <style>{`
        .vscode-table { width: 100%; border-collapse: collapse; font-family: "Consolas", "Courier New", monospace; font-size: 13.5px; color: #d4d4d4; }
        .vscode-table th { position: sticky; top: 0; background-color: #252526; color: #cccccc; text-align: left; padding: 12px 16px; border-bottom: 1px solid #444; font-weight: 600; z-index: 10; letter-spacing: 0.5px; }
        .vscode-table td { padding: 10px 16px; border-bottom: 1px solid #2d2d2d; }
        .vscode-table tr:nth-child(even) td { background-color: #222222; }
        .vscode-table tr:hover td { background-color: #2a2d2e; transition: background-color 0.15s ease; color: #ffffff; }
      `}</style>
      <table className="vscode-table">
        <thead>
          <tr>
            <th style={{ width: 40, textAlign: 'center', color: '#858585' }}>#</th>
            {columns.map((col) => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={{ color: "#858585", textAlign: 'center' }}>{i + 1}</td>
              {columns.map((col) => (
                <td key={col}>
                  {row[col] === null ? (
                    <span style={{ color: "#569cd6", fontStyle: "italic" }}>NULL</span>
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