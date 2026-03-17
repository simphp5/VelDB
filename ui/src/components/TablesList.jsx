export default function TablesList() {
  return (
    <div style={{padding: "20px"}}>
      <h2>Tables List</h2>
      <table style={{width: "100%", borderCollapse: "collapse", marginTop: "20px"}}>
        <thead>
          <tr style={{borderBottom: "2px solid #ddd"}}>
            <th style={{textAlign: "left", padding: "10px"}}>Table Name</th>
            <th style={{textAlign: "left", padding: "10px"}}>Rows</th>
            <th style={{textAlign: "left", padding: "10px"}}>Size</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{borderBottom: "1px solid #ddd"}}>
            <td style={{padding: "10px"}}>users</td>
            <td style={{padding: "10px"}}>1000</td>
            <td style={{padding: "10px"}}>15KB</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
