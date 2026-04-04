// routes/query.js
const express = require("express");
const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/auth");

const router = express.Router();

// Only Admin and Editor
router.post(
  "/run_query",
  authenticateToken,
  authorizeRoles("admin", "editor"),
  (req, res) => {
    res.send("Query executed");
  }
);

// All roles
router.get(
  "/schema",
  authenticateToken,
  authorizeRoles("admin", "editor", "viewer"),
  (req, res) => {
    res.send("Schema data");
  }
);

module.exports = router;