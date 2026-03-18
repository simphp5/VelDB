function QueryHistory({ history }) {
  return (
    <div>
      <h4>History</h4>
      <ul>
        {history.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>
    </div>
  );
}

export default QueryHistory;