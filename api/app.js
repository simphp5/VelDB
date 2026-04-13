const express = require("express");
const morgan = require("morgan");
const rateLimit = require("./middleware/rateLimit");

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimit);

// ✅ Health route
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// ✅ Routes (ONLY ONCE)
app.use("/api/query", require("./routes/query"));
app.use("/api/export", require("./routes/export"));

// ✅ 404 handler (MUST be last)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Export at END
module.exports = app;