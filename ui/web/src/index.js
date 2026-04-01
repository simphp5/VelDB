const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// API
app.get("/api/stats", (req, res) => {
  res.json({ totalQueries: 120 });
});

app.get("/api/history", (req, res) => {
  res.json([{ id: 1, query: "SELECT * FROM users" }]);
});

app.post("/api/ai-query", (req, res) => {
  const { query } = req.body;

  let rows = [];

  if (query?.toLowerCase().includes("users")) {
    rows = [
      { id: 1, name: "Harini", age: 21 },
      { id: 2, name: "Rahul", age: 25 }
    ];
  }

  const columns = rows.length ? Object.keys(rows[0]) : [];

  res.json({ columns, rows });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("VelDB Backend Running 🚀");
});