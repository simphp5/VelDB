import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory, clearHistory } from "../api";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("Clear all query history?")) return;
    try {
      await clearHistory();
      setHistory([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRerun = (query) => {
    navigate(`/sql?q=${encodeURIComponent(query)}`);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp + "Z");
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <span>Loading history...</span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2>Query History</h2>
          <p>Browse and re-execute your past queries</p>
        </div>
        {history.length > 0 && (
          <button className="btn btn-danger btn-sm" onClick={handleClear}>
            🗑️ Clear All
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <div>
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No Query History</h3>
            <p>Queries you execute will appear here. Go to the SQL Editor to run your first query!</p>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {history.map((item) => (
            <div key={item.id} className="history-item">
              <span
                className={`badge ${item.status === "success" ? "badge-success" : "badge-error"}`}
              >
                {item.status === "success" ? "✓" : "✕"} {item.status}
              </span>

              <div className="history-query">
                <code>{item.query_text}</code>
                <div className="history-meta">
                  <span>🕒 {formatTime(item.executed_at)}</span>
                  {item.row_count != null && item.status === "success" && (
                    <span>📊 {item.row_count} rows</span>
                  )}
                  {item.error_message && (
                    <span style={{ color: "var(--error)" }}>
                      ❌ {item.error_message.slice(0, 60)}
                    </span>
                  )}
                </div>
              </div>

              <div className="history-actions">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleCopy(item.query_text)}
                  title="Copy query"
                >
                  📋
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleRerun(item.query_text)}
                  title="Re-run query"
                >
                  ▶️ Run
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
