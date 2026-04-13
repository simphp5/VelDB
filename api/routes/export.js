const express = require("express");
const router = express.Router();

const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

router.post("/", (req, res) => {
  const { data, format } = req.body;

  if (!data || !format) {
    return res.status(400).json({ error: "Missing data or format" });
  }

  // CSV
  if (format === "csv") {
    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("report.csv");
    return res.send(csv);
  }

  // PDF
  if (format === "pdf") {
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

    doc.pipe(res);
    doc.text("Query Results\n\n");

    data.forEach((row, i) => {
      doc.text(`${i + 1}. ${JSON.stringify(row)}`);
    });

    doc.end();
    return;
  }

  res.status(400).json({ error: "Invalid format" });
});

module.exports = router;