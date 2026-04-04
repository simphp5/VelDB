// middleware/auth.js
const jwt = require("jsonwebtoken");
const { ACCESS_SECRET } = require("../auth");

// Verify Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Token required");

  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
}

// Role Authorization
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send("Access denied");
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles
};