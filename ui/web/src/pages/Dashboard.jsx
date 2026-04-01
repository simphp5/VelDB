import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStats } from "../api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="page-header">
          <h2>Dashboard</h2>
        </div>
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <div>
            <strong>Connection Error</strong>
            <p>Could not connect to the server. Make sure the backend is running on port 3001.</p>
            <p style={{ marginTop: 8, fontSize: "0.82rem", opacity: 0.8 }}>{error}</p>
          </div>
        </div>
        <button className="btn btn-secondary mt-4" onClick={loadStats}>
          Retry
        </button>
      </div>
    );
  }

  const quickQueries = [
    "SELECT * FROM customers",
    "SELECT * FROM products",
    "SELECT COUNT(*) FROM orders WHERE status = 'pending'",
    "SELECT name, stock FROM products",
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome to VelDB — your intelligent database platform</p>
      </div>

      {/* Stats */}
      <div className="stats-grid stagger-children">
        <div className="stat-card accent">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">{stats.totalQueries}</div>
          <div className="stat-label">Total Queries</div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.successRate}%</div>
          <div className="stat-label">Success Rate</div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats.tableCount}</div>
          <div className="stat-label">Tables</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.totalRecords}</div>
          <div className="stat-label">Total Records</div>
        </div>
      </div>

      <div className="two-col-grid">
        {/* Recent Queries */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📋 Recent Queries</span>
            <Link to="/history" className="btn btn-ghost btn-sm">
              View All →
            </Link>
          </div>
          {stats.recentQueries.length === 0 ? (
            <div className="empty-state" style={{ padding: "32px" }}>
              <p>No queries yet. Try running one!</p>
            </div>
          ) : (
            <div>
              {stats.recentQueries.map((q) => (
                <div key={q.id} className="history-item" style={{ padding: "12px 0" }}>
                  <span
                    className={`badge ${q.status === "success" ? "badge-success" : "badge-error"}`}
                  >
                    {q.status}
                  </span>
                  <div className="history-query">
                    <code>{q.query_text}</code>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🚀 Quick Actions</span>
          </div>
          <div className="flex flex-col gap-4">
            <Link to="/sql" className="btn btn-primary" style={{ width: "100%" }}>
              ⚡ Open SQL Editor
            </Link>
            <Link to="/ai" className="btn btn-secondary" style={{ width: "100%" }}>
              🤖 AI Query Builder
            </Link>
            <div style={{ marginTop: 8 }}>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 12 }}>
                Try these queries:
              </p>
              <div className="quick-actions">
                {quickQueries.map((q, i) => (
                  <Link key={i} to={`/sql?q=${encodeURIComponent(q)}`} className="quick-action-chip">
                    {q.length > 40 ? q.slice(0, 40) + "..." : q}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
