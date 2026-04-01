import { useState } from "react";
import SqlEditor from "./SqlEditor";
import QueryResults from "./QueryResults";
import TableFilter from "./TableFilter";
import Pagination from "./Pagination";
import QueryHistory from "./QueryHistory";

function SqlPage() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 REAL BACKEND CALL
  const handleRun = async (query) => {
    try {
      setLoading(true);
      setHistory((prev) => [query, ...prev]);

      const res = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      const data = await res.json();

      // expect: { columns: [], rows: [] }
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

  // 🔍 Filter logic
 
   // 🔍 Filter logic
const filteredRows = rows.filter((row) =>
  Object.values(row).some((val) =>
    String(val).toLowerCase().includes(search.toLowerCase())
  )
);

const rowsPerPage = 10;
const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

const paginatedRows = filteredRows.slice(
  (page - 1) * rowsPerPage,
  page * rowsPerPage
);
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  ;

  return (
    <div style={{ padding: "20px" }}>
      <h2>SQL Dashboard</h2>

      <SqlEditor onRun={handleRun} loading={loading} />

      <TableFilter 
  search={search} 
  setSearch={setSearch} 
  total={filteredRows.length} 
/>

      <QueryResults columns={columns} rows={paginatedRows} />

      <Pagination
  page={page}
  totalPages={totalPages}
  setPage={setPage}
  totalRows={filteredRows.length}
  rowsPerPage={rowsPerPage}
/>

     <QueryHistory 
          history={history} 
          onSelect={(q) => handleRun(q)} 
/>
    </div>
  );
}

export default SqlPage;