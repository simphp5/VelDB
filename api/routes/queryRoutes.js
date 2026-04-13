const express = require("express");
const router = express.Router();
const controller = require("../controllers/queryController");

router.post("/run_query", controller.runQuery);
router.get("/tables", controller.getTables);
router.get("/schema/:table", controller.getSchema);

module.exports = router;