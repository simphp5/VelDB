import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div style={{display:"flex", height: "100vh"}}>
      <Sidebar />
      <div style={{display: "flex", flexDirection: "column", flexGrow: 1}}>
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
