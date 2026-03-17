export default function Sidebar() {
  return (
    <div style={{
      width: "250px", 
      borderRight: "1px solid #ccc", 
      padding: "20px",
      backgroundColor: "#f4f4f4"
    }}>
      <h2>VelDB</h2>
      <ul style={{listStyle: "none", padding: 0, marginTop: "20px"}}>
        <li style={{padding: "10px 0", cursor: "pointer"}}>Dashboard</li>
        <li style={{padding: "10px 0", cursor: "pointer"}}>Tables</li>
        <li style={{padding: "10px 0", cursor: "pointer"}}>SQL Editor</li>
        <li style={{padding: "10px 0", cursor: "pointer"}}>Charts</li>
      </ul>
    </div>
  );
}
