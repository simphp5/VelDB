import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { executeQuery } from "../api";
import SqlEditor from "../components/SqlEditor";
import QueryResults from "../components/QueryResults";
import TableFilter from "../components/TableFilter";
import Pagination from "../components/Pagination";

const ROWS_PER_PAGE = 10;

function SqlEditorPage() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [initialQuery, setInitialQuery] = useState("");

  // Handle query param from quick actions
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setInitialQuery(q);
  }, [searchParams]);

  const handleRun = async (sql) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    setResults(null);
    setPage(1);
    setSearch("");

    try {
      const data = await executeQuery(sql);
      setResults(data);
      if (data.type === "MODIFY") {
        setSuccessMsg(`Query executed successfully. ${data.rowCount} row(s) affected.`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter results by search term
  const filteredRows = results?.rows
    ? results.rows.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      )
    : [];

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>SQL Editor</h2>
        <p>Write and execute SQL queries against your database</p>
      </div>

      <div className="card mb-6">
        <SqlEditor onRun={handleRun} loading={loading} initialQuery={initialQuery} />
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error animate-fade-in">
          <span className="alert-icon">❌</span>
          <div>
            <strong>Query Error</strong>
            <p style={{ marginTop: 4 }}>{error}</p>
          </div>
        </div>
      )}

      {/* Success for non-SELECT */}
      {successMsg && (
        <div className="alert alert-success animate-fade-in">
          <span className="alert-icon">✅</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <span>Executing query...</span>
        </div>
      )}

      {/* Results */}
      {results && results.rows && results.rows.length > 0 && (
        <div className="card animate-fade-in">
          <div className="card-header">
            <span className="card-title">
              📊 Results
              <span className="badge badge-info">{results.rowCount} rows</span>
              {results.duration != null && (
                <span className="badge badge-success">{results.duration}ms</span>
              )}
            </span>
            <TableFilter search={search} setSearch={setSearch} />
          </div>

          <QueryResults
            columns={results.columns}
            rows={paginatedRows}
          />

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            setPage={setPage}
            totalRows={filteredRows.length}
            rowsPerPage={ROWS_PER_PAGE}
          />
        </div>
      )}

      {/* Empty results */}
      {results && results.rows && results.rows.length === 0 && !error && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No Results</h3>
            <p>The query executed successfully but returned no rows.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SqlEditorPage;
