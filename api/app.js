// app.js
const express = require("express");
const authRoutes = require("./routes/auth");
const queryRoutes = require("./routes/query");

const app = express();
app.use(express.json());

app.use("/", authRoutes);
app.use("/", queryRoutes);

module.exports = app;