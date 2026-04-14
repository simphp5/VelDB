import { useState, useEffect, useRef } from "react";
import NLQueryInput from "./NLQueryInput";
import AutoComplete from "./AutoComplete";

function SqlEditor({ onRun, onExplain, loading = false, initialQuery = "", onQueryChange }) {
  const [query, setQuery] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => { if (initialQuery) setQuery(initialQuery); }, [initialQuery]);

  const handleQueryChange = (newVal) => {
    setQuery(newVal);
    if (onQueryChange) onQueryChange(newVal);
  };

  const handleSuggestionInsert = (newText, newCursorPos) => {
    handleQueryChange(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursorPos;
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (query.trim() && !loading) onRun(query);
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      handleQueryChange(query.substring(0, start) + "  " + query.substring(end));
      setTimeout(() => { if (textareaRef.current) textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2; }, 0);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <style>{`
        .editor-textarea:focus { border-color: #007acc !important; box-shadow: inset 0 0 0 1px #007acc; }
        .action-btn { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; gap: 8px; }
        .action-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.2); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        .action-btn:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
        .run-btn { background: #0e639c; color: white; border: 1px solid #111; }
        .run-btn:hover:not(:disabled) { background: #1177bb; }
        .explain-btn { background: #333333; color: #cccccc; border: 1px solid #444; }
        .spinner-icon { animation: spin 1.2s linear infinite; display: inline-block; }
      `}</style>
      
      <NLQueryInput onQueryGenerated={(sql) => handleQueryChange(sql)} isLoading={loading} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        {/* Editor Mac-like Tab Header */}
        <div style={{ backgroundColor: '#252526', padding: '10px 16px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'flex', gap: '6px' }}>
            <span style={{width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f56'}}></span>
            <span style={{width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e'}}></span>
            <span style={{width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27c93f'}}></span>
          </span>
          <span style={{ color: '#858585', fontSize: '13px', marginLeft: '12px', fontFamily: 'system-ui', fontWeight: '500' }}>query.sql</span>
        </div>
        
        <div style={{ position: 'relative', flex: 1 }}>
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            rows="10"
            placeholder="-- Write your SQL query here or use AI above..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            disabled={loading}
            style={{
              width: '100%', height: '100%', minHeight: '200px', backgroundColor: '#1e1e1e', color: '#dcdcaa', fontFamily: '"Consolas", "Courier New", monospace',
              fontSize: '15px', padding: '16px', border: 'none', outline: 'none', resize: 'vertical', lineHeight: '1.6', boxSizing: 'border-box',
              transition: 'box-shadow 0.2s', borderBottom: '1px solid #333'
            }}
          />
          <AutoComplete value={query} onInsert={handleSuggestionInsert} textareaRef={textareaRef} />
        </div>

        {/* Editor Bottom Actions Ribbon */}
        <div style={{ padding: '12px 16px', backgroundColor: '#252526', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#858585', fontFamily: 'system-ui' }}>
            Press <kbd style={{ background: '#333', padding: '2px 6px', borderRadius: '4px', border: '1px solid #444', color: '#ccc', boxShadow: '0 2px 0 #111' }}>Ctrl + Enter</kbd> to execute immediately
          </span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="action-btn explain-btn"
              onClick={() => onExplain && onExplain(query)}
              disabled={loading || !query.trim()}
              style={{
                padding: '8px 16px', borderRadius: '4px', cursor: loading || !query.trim() ? 'not-allowed' : 'pointer', fontWeight: '500', fontSize: '13px', opacity: loading || !query.trim() ? 0.5 : 1
              }}
            >
              ⚙️ Explain Plan
            </button>
            <button
              className="action-btn run-btn"
              onClick={() => onRun(query)}
              disabled={loading || !query.trim()}
              style={{
                padding: '8px 24px', borderRadius: '4px', cursor: loading || !query.trim() ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px', opacity: loading || !query.trim() ? 0.5 : 1
              }}
            >
              {loading ? <><span className="spinner-icon">⏳</span> Running...</> : <>▶ Run Query</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SqlEditor;