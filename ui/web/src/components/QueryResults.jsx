function QueryResults({ data }) {
  if (!data.length) return <p>No Data</p>;

  return (
    <table border="1" width="100%">
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {Object.values(row).map((val, j) => (
              <td key={j}>{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default QueryResults;