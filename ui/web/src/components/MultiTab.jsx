export default function MultiTab({ tabs, activeTabId, onTabChange, onAddTab, onRemoveTab }) {
  return (
    <div className="multi-tab-header" style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
      {tabs.map(tab => (
        <div
          key={tab.id}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            borderBottom: activeTabId === tab.id ? '2px solid #3b82f6' : 'none',
            color: activeTabId === tab.id ? '#3b82f6' : '#64748b',
            fontWeight: activeTabId === tab.id ? 'bold' : 'normal',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: activeTabId === tab.id ? '#eff6ff' : 'transparent',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
          }}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.name}
          {tabs.length > 1 && (
            <span
              style={{ marginLeft: 8, color: '#94a3b8', fontSize: '1.2em' }}
              onClick={(e) => { e.stopPropagation(); onRemoveTab(tab.id); }}
            >
              &times;
            </span>
          )}
        </div>
      ))}
      <div
        style={{ padding: '8px 12px', cursor: 'pointer', color: '#64748b', fontWeight: 'bold' }}
        onClick={onAddTab}
        title="Add Tab"
      >
        +
      </div>
    </div>
  );
}
