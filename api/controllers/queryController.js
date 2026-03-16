const processQuery = (req, res) => {
    const { sql } = req.body;

    if (!sql) {
        return res.status(400).json({ success: false, message: "SQL command is required" });
    }

    console.log("SQL command received:", sql);
    res.json({ success: true, message: "Query received", sql });
};

module.exports = { processQuery };