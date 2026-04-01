import { useState } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SqlEditorPage from "./pages/SqlEditorPage";
import HistoryPage from "./pages/HistoryPage";
import AiQueryPage from "./pages/AiQueryPage";

const navItems = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/sql", label: "SQL Editor", icon: "⚡" },
  { path: "/history", label: "History", icon: "📋" },
  { path: "/ai", label: "AI Query", icon: "🤖" },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">V</div>
          <div>
            <h1>VelDB</h1>
            <span>Intelligent Database</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={closeSidebar}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">VelDB v1.0 — Built with ❤️</div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sql" element={<SqlEditorPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/ai" element={<AiQueryPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
