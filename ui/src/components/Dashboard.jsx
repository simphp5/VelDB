import DashboardCards from "./DashboardCards";

export default function Dashboard() {
  return (
    <div style={{padding: "20px", display: "flex", flexDirection: "column", gap: "20px"}}>
      <h1>Dashboard</h1>
      <DashboardCards />
      <div>
        <h2>Total Databases</h2>
        <h2>Total Tables</h2>
        <h2>Total Rows</h2>
      </div>
    </div>
  );
}
