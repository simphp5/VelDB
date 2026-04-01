function Pagination({
  page = 1,
  totalPages = 1,
  setPage,
  totalRows = 0,
  rowsPerPage = 10
}) {
  if (!totalRows || totalPages <= 1) return null;

  const startRow = (page - 1) * rowsPerPage + 1;
  const endRow = Math.min(page * rowsPerPage, totalRows);

  const safeSetPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 2) { start = 2; end = 4; }
      if (page >= totalPages - 1) { start = totalPages - 3; end = totalPages - 1; }

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
        flexWrap: "wrap",
        gap: 12
      }}
    >
      <span className="pagination-info">
        Showing {startRow}–{endRow} of {totalRows} rows
      </span>

      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => safeSetPage(1)}
          disabled={page <= 1}
        >
          «
        </button>

        <button
          className="pagination-btn"
          onClick={() => safeSetPage(page - 1)}
          disabled={page <= 1}
        >
          ‹
        </button>

        {getPageNumbers().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="pagination-info">…</span>
          ) : (
            <button
              key={p}
              className={`pagination-btn ${page === p ? "active" : ""}`}
              onClick={() => safeSetPage(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className="pagination-btn"
          onClick={() => safeSetPage(page + 1)}
          disabled={page >= totalPages}
        >
          ›
        </button>

        <button
          className="pagination-btn"
          onClick={() => safeSetPage(totalPages)}
          disabled={page >= totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
}

export default Pagination;