const express = require("express");
const router = express.Router();

const { addQueryJob, getJobStatus } = require("../jobs/queryJob");

// Run query
router.post("/run_query", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const job = await addQueryJob(query);

  res.json({
    message: "Query queued",
    jobId: job.id,
  });
});

// Job status
router.get("/status/:id", async (req, res) => {
  const result = await getJobStatus(req.params.id);

  if (!result) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.json(result);
});

// Schema
router.get("/schema/:table", (req, res) => {
  res.json({
    table: req.params.table,
    columns: ["id", "name", "email"],
  });
});

module.exports = router;