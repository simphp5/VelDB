const express = require("express");

const helloRoute = require("./routes/hello");
const queryRoute = require("./routes/query");
const tablesRoute = require("./routes/tables");
const createTableRoute = require("./routes/create_table");
const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/", helloRoute);
app.use("/", queryRoute);
app.use("/", tablesRoute);
app.use("/", createTableRoute);
// Home route
app.get("/", (req, res) => {
    res.send("VelDB Backend API Running");
});

// Start server
app.listen(PORT, () => {
    console.log(`VelDB API running on port ${PORT}`);
});