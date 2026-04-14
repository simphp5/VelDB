import { useState } from "react";
import SqlEditor from "./SqlEditor";
import QueryResults from "./QueryResults";
import TableFilter from "./TableFilter";
import Pagination from "./Pagination";
import QueryHistory from "./QueryHistory";
import SchemaSidebar from "./SchemaSidebar";

function SqlPage() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Shared query state for the Page so we can sync Sidebar Inserts
  const [activeQuery, setActiveQuery] = useState("");

  const handleRun = async (queryToRun) => {
    try {
      setLoading(true);
      setHistory((prev) => [queryToRun, ...prev]);

      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryToRun })
      });
      const data = await res.json();
      setColumns(data.columns || []);
      setRows(data.rows || []);
    } catch (err) {
      console.error("Query error:", err);
      setColumns([]);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarInsert = (textToInsert) => {
    setActiveQuery(prev => prev + (prev.endsWith(" ") || prev === "" ? "" : " ") + textToInsert + " ");
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', backgroundColor: '#1e1e1e' }}>
      
      {/* LEFT SIDEBAR: Schema Explorer */}
      <div style={{ width: '280px', flexShrink: 0, borderRight: '1px solid #333', backgroundColor: '#252526' }}>
        <SchemaSidebar onInsert={handleSidebarInsert} />
      </div>

      {/* CENTER WORKSPACE: Editor & Results */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '24px', gap: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#e5e5e5', fontSize: '24px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{color: '#007acc'}}>⚙️</span> Workspace Environment
          </h2>
        </div>

        <div style={{ minHeight: '350px' }}>
          <SqlEditor 
            onRun={handleRun} 
            loading={loading} 
            initialQuery={activeQuery}
            onQueryChange={setActiveQuery}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, color: '#cccccc', fontSize: '16px', borderBottom: '1px solid #333', paddingBottom: '12px' }}>📊 Execution Results</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TableFilter search={search} setSearch={setSearch} total={filteredRows.length} />
            <Pagination page={page} totalPages={totalPages} setPage={setPage} totalRows={filteredRows.length} rowsPerPage={rowsPerPage} />
          </div>

          <QueryResults columns={columns} rows={paginatedRows} />
        </div>

        <div style={{ marginTop: 'auto' }}>
          <QueryHistory history={history} onSelect={(q) => { setActiveQuery(q); handleRun(q); }} />
        </div>
        
      </div>
    </div>
  );
}

export default SqlPage;