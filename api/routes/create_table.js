const express = require("express");

const router = express.Router();

router.post("/create_table", (req, res) => {

    res.json({ message: "Table created" });

});

module.exports = router;