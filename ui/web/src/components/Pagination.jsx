function Pagination({ page, setPage }) {
  return (
    <div>
      <button onClick={() => setPage(page - 1)}>Prev</button>
      <span> Page {page} </span>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}

export default Pagination;