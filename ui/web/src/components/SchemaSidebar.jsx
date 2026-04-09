import { useState, useEffect } from "react";
import { getSchema } from "../api";

export default function SchemaSidebar({ onInsert }) {
  const [schema, setSchema] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTables, setExpandedTables] = useState({});

  useEffect(() => {
    getSchema()
      .then((data) => {
        setSchema(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleTable = (tableName) => {
    setExpandedTables((prev) => ({ ...prev, [tableName]: !prev[tableName] }));
  };

  if (loading) return <div style={{ padding: 16 }}>Loading schema...</div>;
  if (error) return <div style={{ padding: 16, color: "red" }}>{error}</div>;

  return (
    <div className="card animate-fade-in" style={{ padding: 16, height: "100%", overflowY: "auto" }}>
      <h3 style={{ marginTop: 0, marginBottom: 16, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
        📚 Schema
      </h3>
      {schema.map((table) => (
        <div key={table.name} style={{ marginBottom: 8 }}>
          <div
            style={{ fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", color: "#2c3e50" }}
            onClick={() => toggleTable(table.name)}
          >
            <span style={{ marginRight: 6, fontSize: "0.8em", width: 12, display: "inline-block" }}>
              {expandedTables[table.name] ? "▼" : "▶"}
            </span>
            <span
              onDoubleClick={(e) => {
                e.stopPropagation();
                onInsert(table.name);
              }}
              title="Double click to insert table name"
            >
              📋 {table.name}
            </span>
          </div>
          {expandedTables[table.name] && (
            <ul style={{ listStyleType: "none", paddingLeft: 24, margin: "4px 0 8px 0" }}>
              {table.columns.map((col) => (
                <li
                  key={col.name}
                  style={{
                    cursor: "pointer",
                    fontSize: "0.9em",
                    color: "#555",
                    padding: "2px 0",
                  }}
                  onClick={() => onInsert(col.name)}
                  title="Click to insert column name"
                >
                  🔸 {col.name} <span style={{ color: "#aaa", fontSize: "0.85em" }}>({col.type})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <div style={{ fontSize: "0.8em", color: "#888", marginTop: 16 }}>
        <i>Tip: Click column to insert. Double click table to insert.</i>
      </div>
    </div>
  );
}
