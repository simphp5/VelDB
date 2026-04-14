import { useState } from "react";
import { generateSQL, executeQuery } from "../api";
import QueryResults from "../components/QueryResults";
import Pagination from "../components/Pagination";

const ROWS_PER_PAGE = 10;

const examplePrompts = [
  "Show all customers",
  "Show all products",
  "Count pending orders",
  "Show product names and stock quantities",
  "Show highest priced product in Electronics",
  "Find average order value",
  "Show table structure",
  "List products with low stock",
];

function AiQueryPage() {
  const [prompt, setPrompt] = useState("");
  const [generatedSQL, setGeneratedSQL] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const handleGenerate = async (inputPrompt) => {
    const text = inputPrompt || prompt;
    if (!text.trim()) return;

    setGenerating(true);
    setError(null);
    setResults(null);
    setGeneratedSQL("");
    setConfidence(null);

    try {
      const data = await generateSQL(text);
      setGeneratedSQL(data.sql);
      setConfidence(data.confidence);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleExecute = async () => {
    if (!generatedSQL.trim()) return;

    setExecuting(true);
    setError(null);
    setResults(null);
    setPage(1);

    try {
      const data = await executeQuery(generatedSQL);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setExecuting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  // Pagination
  const allRows = results?.rows || [];
  const totalPages = Math.max(1, Math.ceil(allRows.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = allRows.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>AI Query Builder</h2>
        <p>Describe what you want in plain English — we'll generate the SQL for you</p>
      </div>

      {/* Input */}
      <div className="card mb-6">
        <div className="card-header">
          <span className="card-title">🤖 Natural Language Input</span>
        </div>
        <div className="ai-input-wrapper">
          <input
            type="text"
            className="ai-input"
            placeholder="e.g., Show all customers or count pending orders..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={generating}
          />
          <button
            className="btn btn-primary ai-submit-btn"
            onClick={() => handleGenerate()}
            disabled={generating || !prompt.trim()}
          >
            {generating ? (
              <>
                <span className="spinner" /> Generating...
              </>
            ) : (
              "✨ Generate SQL"
            )}
          </button>
        </div>

        {/* Example prompts */}
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 10 }}>
            Try an example:
          </p>
          <div className="quick-actions">
            {examplePrompts.map((ep, i) => (
              <button
                key={i}
                className="quick-action-chip"
                onClick={() => {
                  setPrompt(ep);
                  handleGenerate(ep);
                }}
              >
                {ep}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated SQL */}
      {generatedSQL && (
        <div className="card mb-6 animate-fade-in">
          <div className="card-header">
            <div>
              <span className="ai-generated-label">
                ✨ AI Generated
                {confidence && (
                  <span
                    className={`badge ${confidence === "high" ? "badge-success" : "badge-warning"}`}
                    style={{ marginLeft: 8 }}
                  >
                    {confidence} confidence
                  </span>
                )}
              </span>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleExecute}
              disabled={executing}
            >
              {executing ? (
                <>
                  <span className="spinner" /> Executing...
                </>
              ) : (
                "▶️ Execute Query"
              )}
            </button>
          </div>

          <textarea
            className="sql-textarea"
            value={generatedSQL}
            onChange={(e) => setGeneratedSQL(e.target.value)}
            rows={Math.max(3, generatedSQL.split("\n").length + 1)}
          />
          <p
            style={{
              marginTop: 8,
              fontSize: "0.78rem",
              color: "var(--text-muted)",
            }}
          >
            You can edit the SQL above before executing
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-error animate-fade-in">
          <span className="alert-icon">❌</span>
          <div>
            <strong>Error</strong>
            <p style={{ marginTop: 4 }}>{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {executing && (
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
          </div>

          <QueryResults columns={results.columns} rows={paginatedRows} />

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            setPage={setPage}
            totalRows={allRows.length}
            rowsPerPage={ROWS_PER_PAGE}
          />
        </div>
      )}

      {results && results.rows && results.rows.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No Results</h3>
            <p>Query executed successfully but returned no rows.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiQueryPage;
