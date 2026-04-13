// auth.js
const jwt = require("jsonwebtoken");

const ACCESS_SECRET = "access_secret_key";
const REFRESH_SECRET = "refresh_secret_key";

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  ACCESS_SECRET,
  REFRESH_SECRET
};