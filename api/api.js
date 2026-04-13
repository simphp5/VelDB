const express = require("express");
const { runQuery } = require("./service/db");

const app = express();
app.use(express.json());

/* Health check */
app.get("/", (req, res) => {
    res.send("VelDB API Running ");
});

/* Run SQL Query */
app.post("/run_query", async (req, res) => {
    try {
        const query = req.body.query;

        if (!query) {
            return res.status(400).json({ error: "Query is required" });
        }

        const result = await runQuery(query);

        res.json({
            success: true,
            data: result
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.toString()
        });
    }
});

/* Get all tables */
app.get("/tables", async (req, res) => {
    try {
        const result = await runQuery("SHOW TABLES");

        res.json({
            success: true,
            tables: result
        });

    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

/* Get schema of a table */
app.get("/schema/:table", async (req, res) => {
    try {
        const table = req.params.table;

        const result = await runQuery(`DESCRIBE ${table}`);

        res.json({
            success: true,
            schema: result
        });

    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

/* Start server */
app.listen(3000, () => {
    console.log("VelDB API running on http://localhost:3000");
});