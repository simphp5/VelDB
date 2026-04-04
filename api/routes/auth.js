// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_SECRET
} = require("../auth");

const router = express.Router();

// Demo users
const users = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "editor", password: "editor123", role: "editor" },
  { id: 3, username: "viewer", password: "viewer123", role: "viewer" }
];

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user || user.password !== password)
    return res.status(401).send("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({ accessToken, refreshToken });
});

// REFRESH TOKEN
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.send("Logged out successfully");
});

module.exports = router;