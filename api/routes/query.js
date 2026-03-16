const express = require("express");

const router = express.Router();

router.post("/query", (req, res) => {

    const sql = "SELECT * FROM users";

    res.json({
        message: "Query received",
        sql: sql
    });

});

module.exports = router;