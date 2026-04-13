const express = require("express");

const router = express.Router();

router.get("/tables", (req, res) => {

    res.json([ "users", "products", "orders" ]);

});

module.exports = router;
