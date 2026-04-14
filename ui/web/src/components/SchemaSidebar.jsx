import { useState, useEffect } from "react";
import { getSchema } from "../api";

export default function SchemaSidebar({ onInsert }) {
  const [schema, setSchema] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTables, setExpandedTables] = useState({});
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    // Faking API call or utilizing imported function
    if (getSchema) {
      getSchema()
        .then((data) => { setSchema(data); setLoading(false); })
        .catch((err) => { setError(err.message); setLoading(false); });
    }
  }, []);

  const toggleTable = (tableName) => {
    setExpandedTables((prev) => ({ ...prev, [tableName]: !prev[tableName] }));
  };

  if (loading) return <div style={{ padding: 16, color: '#858585', backgroundColor: '#252526', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading schema...</div>;
  if (error) return <div style={{ padding: 16, color: "#f44336", backgroundColor: '#252526', height: '100%' }}>{error}</div>;

  return (
    <div className="schema-sidebar" style={{ 
      backgroundColor: '#252526', color: '#cccccc', padding: '16px', height: '100%', 
      overflowY: 'auto', borderRight: '1px solid #333', fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      <h3 style={{ 
        marginTop: 0, marginBottom: 16, borderBottom: "1px solid #333", paddingBottom: 12, 
        fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#858585', fontWeight: '600' 
      }}>
        📚 Database Explorer
      </h3>
      <div style={{ fontSize: '13px' }}>
        {schema.map((table) => (
          <div key={table.name} style={{ marginBottom: 4 }}>
            <div
              onMouseEnter={() => setHoveredNode(table.name)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{
                fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", padding: '6px 8px', borderRadius: '4px',
                backgroundColor: hoveredNode === table.name ? '#37373d' : 'transparent',
                transition: 'background-color 0.15s ease'
              }}
              onClick={() => toggleTable(table.name)}
              onDoubleClick={(e) => { e.stopPropagation(); onInsert(table.name); }}
              title="Double click to insert table name"
            >
              <span style={{ 
                marginRight: 8, fontSize: "10px", width: 14, display: "inline-block", 
                transition: 'transform 0.2s', transform: expandedTables[table.name] ? 'rotate(90deg)' : 'rotate(0deg)', color: '#858585' 
              }}>
                ▶
              </span>
              <span style={{ marginRight: 8, color: '#dcdcaa' }}>🗄️</span>
              {table.name}
            </div>
            
            {expandedTables[table.name] && (
              <ul style={{ listStyleType: "none", paddingLeft: 28, margin: "2px 0 8px 0" }}>
                {table.columns.map((col) => {
                  const nodeKey = `${table.name}-${col.name}`;
                  return (
                    <li
                      key={col.name}
                      onMouseEnter={() => setHoveredNode(nodeKey)}
                      onMouseLeave={() => setHoveredNode(null)}
                      style={{
                        cursor: "pointer", fontSize: "13px", color: "#d4d4d4", padding: "4px 8px", borderRadius: '4px',
                        backgroundColor: hoveredNode === nodeKey ? '#37373d' : 'transparent',
                        display: 'flex', alignItems: 'center', transition: 'background-color 0.15s ease'
                      }}
                      onClick={() => onInsert(col.name)}
                      title="Click to insert column name"
                    >
                      <span style={{ color: '#569cd6', marginRight: '8px', fontSize: '14px' }}>▪</span>
                      {col.name} 
                      <span style={{ color: "#6b6b6b", fontSize: "11px", marginLeft: 'auto', fontFamily: 'monospace' }}>
                        {col.type}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
