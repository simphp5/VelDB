import { useState, useEffect, useRef } from "react";

function SqlEditor({ onRun, onExplain, loading = false, initialQuery = "", onQueryChange }) {
  const [query, setQuery] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (query.trim() && !loading) onRun(query);
    }

    // Tab for indentation
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newVal = query.substring(0, start) + "  " + query.substring(end);
      setQuery(newVal);
      setTimeout(() => {
        textareaRef.current.selectionStart =
          textareaRef.current.selectionEnd = start + 2;
      }, 0);
    }
  };

  // 🔥 NEW: Example queries (updated schema)
  const examples = [
    "SELECT * FROM customers;",
    "SELECT * FROM products;",
    "SELECT COUNT(*) FROM orders WHERE status = 'pending';",
    "SELECT name, stock FROM products;",
    "SELECT * FROM products WHERE category = 'Electronics' ORDER BY price DESC LIMIT 1;",
    "SELECT AVG(total_amount) FROM orders;"
  ];

  return (
    <div className="sql-editor-wrapper">
      <div className="card-header" style={{ marginBottom: 12 }}>
        <span className="card-title">⚡ SQL Editor</span>
      </div>

      <textarea
        ref={textareaRef}
        className="sql-textarea"
        rows="6"
        placeholder="Try: SELECT * FROM customers;"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (onQueryChange) onQueryChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        spellCheck="false"
        disabled={loading}
      />

      {/* 🔥 NEW: Example buttons */}
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        {examples.map((ex, index) => (
          <button
            key={index}
            className="btn btn-secondary"
            style={{ marginRight: 8, marginBottom: 8 }}
            onClick={() => setQuery(ex)}
            disabled={loading}
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="editor-toolbar">
        <span className="editor-hint">
          <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run · <kbd>Tab</kbd> to indent
        </span>
        <div style={{display: 'flex', gap: '8px'}}>
          <button
            className="btn btn-secondary"
            onClick={() => onExplain && onExplain(query)}
            disabled={loading || !query.trim()}
          >
            🔍 Explain
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onRun(query)}
            disabled={loading || !query.trim()}
            id="run-query-btn"
          >
            {loading ? (
              <>
                <span className="spinner" /> Running...
              </>
            ) : (
              "▶️ Run Query"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SqlEditor;