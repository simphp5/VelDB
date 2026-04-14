import React, { useState, useEffect, useCallback } from 'react';

const KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'INSERT INTO', 'UPDATE', 'DELETE', 'JOIN', 'LEFT JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'LIMIT', 'AND', 'OR', 'AS', 'COUNT()', 'MAX()', 'MIN()'];
// Schema data
const TABLES = ['employees', 'departments', 'salaries', 'customers', 'products', 'orders'];
const COLUMNS = ['id', 'name', 'salary', 'department_id', 'created_at', 'status', 'age', 'email', 'price', 'total_amount', 'stock', 'category'];

export default function AutoComplete({ value, onInsert, textareaRef }) {
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [show, setShow] = useState(false);
  const [matchStart, setMatchStart] = useState(0);
  const [matchEnd, setMatchEnd] = useState(0);

  // Parse current word out of the text at the cursor position
  const handleSelection = useCallback(() => {
    if (!textareaRef.current) return;
    const { selectionStart } = textareaRef.current;
    
    // Find the word right before the cursor
    const textUpToCursor = value.substring(0, selectionStart);
    const words = textUpToCursor.split(/[\s,()]+/);
    const currentWord = words[words.length - 1];
    
    if (currentWord.length > 0) {
      const lower = currentWord.toLowerCase();
      // Only suggest if the user typed at least 1 letter and it's not a complete exact match already
      const matchingKeywords = KEYWORDS.filter(w => w.toLowerCase().startsWith(lower) && w.toLowerCase() !== lower);
      const matchingTables = TABLES.filter(w => w.toLowerCase().startsWith(lower) && w.toLowerCase() !== lower);
      const matchingCols = COLUMNS.filter(w => w.toLowerCase().startsWith(lower) && w.toLowerCase() !== lower);
      
      const combined = [...matchingKeywords, ...matchingTables, ...matchingCols].slice(0, 10);
      
      if (combined.length > 0) {
        setSuggestions(combined);
        setShow(true);
        setActiveIndex(0);
        
        // Find exact string start/end indices for replacement
        const regex = /[\s,()]/;
        let start = selectionStart - 1;
        while (start >= 0 && !regex.test(value[start])) {
          start--;
        }
        setMatchStart(start + 1);
        setMatchEnd(selectionStart);
      } else {
        setShow(false);
      }
    } else {
      setShow(false);
    }
  }, [value, textareaRef]);

  useEffect(() => {
    handleSelection();
  }, [value, handleSelection]);

  // Handle keyboard navigation for the suggestions box
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const handleKeyDown = (e) => {
      if (!show) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          applySuggestion(suggestions[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShow(false);
      }
    };

    el.addEventListener('keydown', handleKeyDown);
    return () => el.removeEventListener('keydown', handleKeyDown);
  }, [show, suggestions, activeIndex, textareaRef]);

  const applySuggestion = (suggestion) => {
    const before = value.substring(0, matchStart);
    const after = value.substring(matchEnd);
    const newText = before + suggestion + ' ' + after;
    // Insert suggestion and adjust cursor
    onInsert(newText, before.length + suggestion.length + 1);
    setShow(false);
  };

  if (!show || suggestions.length === 0) return null;

  return (
    <div 
      className="autocomplete-dropdown"
      role="listbox"
      aria-label="SQL Suggestions"
      style={{
        position: 'absolute',
        backgroundColor: '#252526', // VS Code dark theme
        border: '1px solid #454545',
        borderRadius: '4px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        zIndex: 100,
        maxHeight: '200px',
        overflowY: 'auto',
        minWidth: '220px',
        padding: '4px 0',
        top: '40px', // Positioning to float within editor component
        right: '25px'
      }}
    >
      <div aria-live="assertive" className="sr-only" style={{ position: 'absolute', left: '-9999px' }}>
        {show ? `${suggestions.length} suggestions available. Use Up and Down arrows to navigate.` : ''}
      </div>
      {suggestions.map((s, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div
            key={s}
            role="option"
            aria-selected={isActive}
            onClick={() => applySuggestion(s)}
            onFocus={() => setActiveIndex(idx)}
            onMouseEnter={() => setActiveIndex(idx)}
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              backgroundColor: isActive ? '#094771' : 'transparent', // VS Code selection color
              color: '#d4d4d4',
              fontFamily: '"Consolas", "Courier New", monospace',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>{s}</span>
            {KEYWORDS.includes(s) && <span style={{fontSize:'10px', color:'#569cd6'}}>Keyword</span>}
            {TABLES.includes(s) && <span style={{fontSize:'10px', color:'#4ec9b0'}}>Table</span>}
            {COLUMNS.includes(s) && <span style={{fontSize:'10px', color:'#9cdcfe'}}>Column</span>}
          </div>
        );
      })}
    </div>
  );
}
