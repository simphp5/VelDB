const db = require("../service/db");

exports.runQuery = async (req, res) => {
    try {
        const result = await db.runQuery(req.body.query);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.getTables = async (req, res) => {
    try {
        const result = await db.runQuery("SHOW TABLES");
        res.json({ tables: result });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.getSchema = async (req, res) => {
    try {
        const table = req.params.table;
        const result = await db.runQuery(`DESCRIBE ${table}`);
        res.json({ schema: result });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};