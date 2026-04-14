import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { executeQuery, explainQuery } from "../api";
import SqlEditor from "../components/SqlEditor";
import QueryResults from "../components/QueryResults";
import TableFilter from "../components/TableFilter";
import Pagination from "../components/Pagination";
import SchemaSidebar from "../components/SchemaSidebar";
import MultiTab from "../components/MultiTab";
import ExplainView from "../components/ExplainView";
import SavedQueries from "../components/SavedQueries";

const ROWS_PER_PAGE = 10;

function SqlEditorPage() {
  const [searchParams] = useSearchParams();
  const [tabs, setTabs] = useState([
    { id: 1, name: "Query 1", query: "", results: null, error: null, successMsg: null, explainResults: null, loading: false, search: "", page: 1 }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextTabId, setNextTabId] = useState(2);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      updateActiveTab({ query: q });
    }
  }, [searchParams]);

  const updateActiveTab = (updates) => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, ...updates } : t));
  };

  const handleRun = async (sql) => {
    updateActiveTab({ loading: true, error: null, successMsg: null, results: null, explainResults: null, page: 1, search: "" });
    try {
      const data = await executeQuery(sql);
      updateActiveTab({
        loading: false,
        results: data,
        successMsg: data.type === "MODIFY" ? `Query executed successfully. ${data.rowCount} row(s) affected.` : null,
      });
    } catch (err) {
      updateActiveTab({ loading: false, error: err.message });
    }
  };

  const handleExplain = async (sql) => {
    updateActiveTab({ loading: true, error: null, successMsg: null, explainResults: null });
    try {
      const data = await explainQuery(sql);
      updateActiveTab({ loading: false, explainResults: data });
    } catch (err) {
      updateActiveTab({ loading: false, error: err.message });
    }
  };

  const handleInsert = (text) => {
    updateActiveTab({ query: activeTab.query + (activeTab.query && !activeTab.query.endsWith(' ') ? ' ' : '') + text });
  };

  const handleExportCSV = () => {
    const { results } = activeTab;
    if (!results || !results.columns || !results.rows) return;
    const header = results.columns.join(",");
    const csvRows = results.rows.map(row => results.columns.map(col => `"${row[col] !== null ? String(row[col]).replace(/"/g, '""') : ''}"`).join(","));
    const csvStr = [header, ...csvRows].join("\n");
    const blob = new Blob([csvStr], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `query_export_${activeTab.id}.csv`;
    a.click();
  };

  const filteredRows = activeTab.results?.rows
    ? activeTab.results.rows.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(activeTab.search.toLowerCase())
        )
      )
    : [];

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE));
  const currentPage = Math.min(activeTab.page, totalPages);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header" style={{ marginBottom: 16 }}>
        <h2>SQL Editor</h2>
        <p>Write and execute SQL queries against your database</p>
      </div>

      <div style={{ display: 'flex', flex: 1, gap: 16, alignItems: 'flex-start' }}>
        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: 16, height: 'calc(100vh - 120px)' }}>
          <div style={{ flex: '1 1 50%', minHeight: 0 }}>
            <SchemaSidebar onInsert={handleInsert} />
          </div>
          <div style={{ flex: '1 1 50%', minHeight: 0, overflowY: 'auto' }}>
            <SavedQueries currentQuery={activeTab.query} onSelectQuery={(q) => updateActiveTab({ query: q })} />
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <MultiTab
            tabs={tabs}
            activeTabId={activeTabId}
            onTabChange={setActiveTabId}
            onAddTab={() => {
              setTabs([...tabs, { id: nextTabId, name: `Query ${nextTabId}`, query: "", results: null, error: null, successMsg: null, explainResults: null, loading: false, search: "", page: 1 }]);
              setActiveTabId(nextTabId);
              setNextTabId(prev => prev + 1);
            }}
            onRemoveTab={(id) => {
              if (tabs.length === 1) return;
              const newTabs = tabs.filter(t => t.id !== id);
              setTabs(newTabs);
              if (activeTabId === id) setActiveTabId(newTabs[newTabs.length - 1].id);
            }}
          />

          <div className="card mb-6">
            <SqlEditor
              onRun={handleRun}
              onExplain={handleExplain}
              loading={activeTab.loading}
              initialQuery={activeTab.query}
              onQueryChange={(q) => updateActiveTab({ query: q })}
            />
          </div>

          {activeTab.error && (
            <div className="alert alert-error animate-fade-in">
              <span className="alert-icon">❌</span>
              <div>
                <strong>Query Error</strong>
                <p style={{ marginTop: 4 }}>{activeTab.error}</p>
              </div>
            </div>
          )}

          {activeTab.successMsg && (
            <div className="alert alert-success animate-fade-in">
              <span className="alert-icon">✅</span>
              <span>{activeTab.successMsg}</span>
            </div>
          )}

          {activeTab.loading && (
            <div className="loading-overlay" style={{ marginTop: 16 }}>
              <div className="spinner" />
              <span>Executing query...</span>
            </div>
          )}

          {activeTab.explainResults && !activeTab.loading && (
            <ExplainView explainResults={activeTab.explainResults} />
          )}

          {activeTab.results && activeTab.results.rows && activeTab.results.rows.length > 0 && !activeTab.loading && (
            <div className="card animate-fade-in" style={{ marginTop: 16 }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="card-title" style={{ marginRight: 12 }}>
                    📊 Results
                  </span>
                  <span className="badge badge-info">{activeTab.results.rowCount} rows</span>
                  {activeTab.results.duration != null && (
                    <span className="badge badge-success" style={{ marginLeft: 8 }}>{activeTab.results.duration}ms</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <button className="btn btn-secondary" onClick={handleExportCSV}>📥 Export CSV</button>
                  <TableFilter search={activeTab.search} setSearch={s => updateActiveTab({ search: s, page: 1 })} />
                </div>
              </div>

              <QueryResults
                columns={activeTab.results.columns}
                rows={paginatedRows}
              />

              <Pagination
                page={currentPage}
                totalPages={totalPages}
                setPage={p => updateActiveTab({ page: p })}
                totalRows={filteredRows.length}
                rowsPerPage={ROWS_PER_PAGE}
              />
            </div>
          )}

          {activeTab.results && activeTab.results.rows && activeTab.results.rows.length === 0 && !activeTab.error && !activeTab.loading && (
            <div className="card" style={{ marginTop: 16 }}>
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No Results</h3>
                <p>The query executed successfully but returned no rows.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SqlEditorPage;
