export default function DashboardCards() {
  return (
    <div style={{display: "flex", gap: "20px"}}>
      <div style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        flex: 1,
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{margin: "0 0 10px 0"}}>Databases</h3>
        <p style={{margin: 0, fontSize: "24px", fontWeight: "bold"}}>Total Databases</p>
      </div>
      <div style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        flex: 1,
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{margin: "0 0 10px 0"}}>Tables</h3>
        <p style={{margin: 0, fontSize: "24px", fontWeight: "bold"}}>Total Tables</p>
      </div>
      <div style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        flex: 1,
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{margin: "0 0 10px 0"}}>Rows</h3>
        <p style={{margin: 0, fontSize: "24px", fontWeight: "bold"}}>Total Rows</p>
      </div>
    </div>
  );
}
