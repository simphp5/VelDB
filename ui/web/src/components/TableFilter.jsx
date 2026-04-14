function TableFilter({ search, setSearch, total = 0 }) {
  return (
    <div style={{ marginTop: 15, marginBottom: 15 }}>
      
      <div className="search-input-wrapper">
        <span className="search-input-icon">🔍</span>

        <input
          className="search-input"
          placeholder="Search in results (name, product, etc...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="table-filter-input"
        />

        {/* 🔥 Clear button */}
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{
              marginLeft: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 16
            }}
          >
            ❌
          </button>
        )}
      </div>

      {/* 🔥 Result count */}
      <div style={{ marginTop: 6, fontSize: 13, color: "#666" }}>
        {total > 0 ? `${total} result(s)` : "No results"}
      </div>

    </div>
  );
}

export default TableFilter;