import React, { useState } from 'react';
import { generateSQL } from '../api';

export default function NLQueryInput({ onQueryGenerated, isLoading }) {
  const [nlText, setNlText] = useState('');
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nlText.trim()) return;
    setFetching(true); setError('');

    try {
      // Calls actual backend (POST /api/ai-query) via api.js
      const data = await generateSQL(nlText);
      onQueryGenerated(data.sql);
      setNlText('');
    } catch (err) {
      setError(err.message || "Network or API failure. Please try again.");
    } finally {
      setFetching(false);
    }
  };

  return (
    <div style={{ marginBottom: '24px', backgroundColor: '#1e1e1e', padding: '16px', borderRadius: '8px', border: '1px solid #333', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s ease' }}>
      <style>{`
        .ai-input:focus { border-color: #007acc !important; box-shadow: inset 0 0 0 1px #007acc; outline: none; }
        .btn-ai { transition: all 0.2s ease; background: linear-gradient(180deg, #0e639c 0%, #0b507d 100%); }
        .btn-ai:hover:not(:disabled) { background: linear-gradient(180deg, #1177bb 0%, #0e639c 100%); transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        .btn-ai:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
        .spinner-ai { animation: spin 1s linear infinite; display: inline-block; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '18px', color: '#dcdcaa' }}>⚡</span>
          <span style={{ color: '#e5e5e5', fontSize: '14px', fontWeight: 'bold' }}>AI Query Assistant</span>
          <span style={{ color: '#858585', fontSize: '12px', marginLeft: 'auto' }}>Powered by Natural Language Model</span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#858585', fontSize: '14px' }}>✨</span>
            <input
              type="text"
              className="ai-input"
              value={nlText}
              onChange={(e) => setNlText(e.target.value)}
              placeholder="e.g., 'Find all products under $50 ordered by descending price'"
              disabled={fetching || isLoading}
              aria-invalid={!!error}
              style={{
                width: '100%', padding: '12px 12px 12px 36px', backgroundColor: '#252526', border: `1px solid ${error ? '#f44336' : '#3c3c3c'}`,
                color: '#d4d4d4', borderRadius: '6px', fontSize: '14px', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            type="submit"
            className="btn-ai"
            disabled={fetching || isLoading || !nlText.trim()}
            style={{
              padding: '0 24px', color: '#ffffff', border: '1px solid #000', borderRadius: '6px', cursor: fetching || !nlText.trim() ? 'not-allowed' : 'pointer',
              fontWeight: '600', fontSize: '14px', opacity: fetching || !nlText.trim() ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            {fetching ? <><span className="spinner-ai">⚙️</span> Generating...</> : 'Generate SQL'}
          </button>
        </div>
        
        {error && <div style={{ color: '#f44336', marginTop: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><span>⚠️</span> {error}</div>}
      </form>
    </div>
  );
}
