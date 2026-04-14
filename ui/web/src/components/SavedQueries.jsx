import { useState, useEffect } from "react";
import { getSavedQueries, saveQuery } from "../api";

export default function SavedQueries({ currentQuery, onSelectQuery }) {
  const [savedQueries, setSavedQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);

  const fetchQueries = () => {
    setLoading(true);
    getSavedQueries()
      .then((data) => {
        setSavedQueries(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleSave = async () => {
    if (!nameInput.trim()) return;
    try {
      await saveQuery(nameInput, currentQuery);
      setNameInput("");
      setShowSaveModal(false);
      fetchQueries();
    } catch (err) {
      alert("Failed to save: " + err.message);
    }
  };

  return (
    <div className="card animate-fade-in" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>💾 Saved Queries</h3>
        <button
          className="btn btn-primary"
          style={{ padding: '4px 8px', fontSize: '0.9em' }}
          onClick={() => setShowSaveModal(true)}
          disabled={!currentQuery.trim()}
        >
          Save Current
        </button>
      </div>

      {showSaveModal && (
        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Query Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="input"
            style={{ flex: 1, padding: '4px 8px' }}
          />
          <button className="btn btn-success" onClick={handleSave}>Save</button>
          <button className="btn btn-secondary" onClick={() => setShowSaveModal(false)}>Cancel</button>
        </div>
      )}

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && savedQueries.length === 0 && (
        <div style={{ color: '#666', fontSize: '0.9em' }}>No saved queries yet.</div>
      )}

      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        {savedQueries.map((sq) => (
          <li
            key={sq.id}
            style={{
              padding: '8px 0',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}
            onClick={() => onSelectQuery(sq.query_text)}
          >
            <strong style={{ color: '#2c3e50' }}>{sq.name}</strong>
            <span style={{ fontSize: '0.85em', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {sq.query_text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
