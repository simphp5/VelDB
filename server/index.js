import express from 'express';
import cors from 'cors';
import { initDatabase, getDb, saveDb } from './db.js';
import { seedDatabase } from './seed.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper: run a SELECT query and return results as array of objects
function queryToObjects(db, sql) {
  const stmt = db.prepare(sql);
  const columns = stmt.getColumnNames();
  const rows = [];
  while (stmt.step()) {
    const values = stmt.get();
    const row = {};
    columns.forEach((col, i) => { row[col] = values[i]; });
    rows.push(row);
  }
  stmt.free();
  return { columns, rows };
}

// Helper: get a single value
function queryScalar(db, sql) {
  const result = db.exec(sql);
  return result[0]?.values[0][0] ?? 0;
}

// ─── POST /api/query ─── Execute SQL ───────────────────────────────────
app.post('/api/query', (req, res) => {
  const { sql } = req.body;
  const db = getDb();

  if (!sql || !sql.trim()) {
    return res.status(400).json({ error: 'SQL query is required' });
  }

  const trimmed = sql.trim();
  const isSelect = /^(SELECT|PRAGMA|EXPLAIN)/i.test(trimmed);

  try {
    let result;
    const startTime = Date.now();

    if (isSelect) {
      const { columns, rows } = queryToObjects(db, trimmed);
      const duration = Date.now() - startTime;

      result = {
        columns,
        rows,
        rowCount: rows.length,
        duration,
        type: 'SELECT'
      };
    } else {
      db.run(trimmed);
      const changes = db.getRowsModified();
      const duration = Date.now() - startTime;

      result = {
        columns: ['changes'],
        rows: [{ changes }],
        rowCount: changes,
        duration,
        type: 'MODIFY'
      };
      saveDb();
    }

    // Log to history
    try {
      db.run(
        "INSERT INTO query_history (query_text, status, row_count) VALUES (?, 'success', ?)",
        [trimmed, result.rowCount]
      );
      saveDb();
    } catch (e) { /* ignore */ }

    res.json(result);
  } catch (err) {
    // Log failed query to history
    try {
      db.run(
        "INSERT INTO query_history (query_text, status, error_message) VALUES (?, 'error', ?)",
        [trimmed, err.message]
      );
      saveDb();
    } catch (e) { /* ignore */ }

    res.status(400).json({ error: err.message });
  }
});

// ─── GET /api/history ─── Query History ────────────────────────────────
app.get('/api/history', (req, res) => {
  try {
    const db = getDb();
    const limit = parseInt(req.query.limit) || 50;
    const { rows } = queryToObjects(db, `SELECT * FROM query_history ORDER BY executed_at DESC LIMIT ${limit}`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/history ─── Clear History ─────────────────────────────
app.delete('/api/history', (req, res) => {
  try {
    const db = getDb();
    db.run('DELETE FROM query_history');
    saveDb();
    res.json({ message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/ai-query ─── Natural Language to SQL ────────────────────
app.post('/api/ai-query', (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const lower = prompt.toLowerCase().trim();
  let sql = '';

  // Pattern matching for common queries
  if (lower.match(/show\s+(all\s+)?tables/)) {
    sql = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'";
  }
  else if (lower.match(/(show|get|list|display|fetch)\s+(all\s+)?(students|data|records|everything)/)) {
    sql = 'SELECT * FROM students';
  }
  else if (lower.match(/(count|how many)\s+(students|records|rows)/)) {
    sql = 'SELECT COUNT(*) as total_count FROM students';
  }
  else if (lower.match(/(show|get|find|list)\s+(students?\s+)?(in|from|of)\s+(department\s+)?(\w+)/)) {
    const match = lower.match(/(show|get|find|list)\s+(students?\s+)?(in|from|of)\s+(department\s+)?(\w+)/);
    const dept = match[5].toUpperCase();
    sql = `SELECT * FROM students WHERE dept = '${dept}'`;
  }
  else if (lower.match(/(show|get|find)\s+(students?\s+)?with\s+gpa\s*(>|above|greater|more)\s*(than\s+)?(\d+\.?\d*)/)) {
    const match = lower.match(/(show|get|find)\s+(students?\s+)?with\s+gpa\s*(>|above|greater|more)\s*(than\s+)?(\d+\.?\d*)/);
    sql = `SELECT * FROM students WHERE gpa > ${match[5]}`;
  }
  else if (lower.match(/(show|get|find)\s+(students?\s+)?with\s+gpa\s*(<|below|less)\s*(than\s+)?(\d+\.?\d*)/)) {
    const match = lower.match(/(show|get|find)\s+(students?\s+)?with\s+gpa\s*(<|below|less)\s*(than\s+)?(\d+\.?\d*)/);
    sql = `SELECT * FROM students WHERE gpa < ${match[5]}`;
  }
  else if (lower.match(/(average|avg)\s+(gpa|grade)/)) {
    sql = 'SELECT dept, ROUND(AVG(gpa), 2) as avg_gpa FROM students GROUP BY dept ORDER BY avg_gpa DESC';
  }
  else if (lower.match(/(top|best|highest)\s+(\d+)?\s*(students|performers)/)) {
    const match = lower.match(/(top|best|highest)\s+(\d+)?\s*(students|performers)/);
    const n = match[2] || 5;
    sql = `SELECT * FROM students ORDER BY gpa DESC LIMIT ${n}`;
  }
  else if (lower.match(/(students?\s+)?(in|from)\s+year\s+(\d)/)) {
    const match = lower.match(/(students?\s+)?(in|from)\s+year\s+(\d)/);
    sql = `SELECT * FROM students WHERE year = ${match[3]}`;
  }
  else if (lower.match(/describe|structure|schema|columns/)) {
    sql = "PRAGMA table_info(students)";
  }
  else if (lower.match(/(department|dept)\s*(wise\s+)?(count|summary|breakdown)/)) {
    sql = 'SELECT dept, COUNT(*) as count, ROUND(AVG(gpa), 2) as avg_gpa FROM students GROUP BY dept ORDER BY count DESC';
  }
  else if (lower.match(/sort\s+(by\s+)?(name|gpa|year|dept|id)/)) {
    const match = lower.match(/sort\s+(by\s+)?(name|gpa|year|dept|id)/);
    const col = match[2];
    const dir = lower.includes('desc') ? 'DESC' : 'ASC';
    sql = `SELECT * FROM students ORDER BY ${col} ${dir}`;
  }
  else {
    sql = `-- Could not auto-generate SQL for: "${prompt}"\n-- Try: "show all students", "find students in CSE", "top 5 students"\nSELECT * FROM students LIMIT 10`;
  }

  res.json({
    sql,
    prompt: prompt.trim(),
    confidence: sql.startsWith('--') ? 'low' : 'high'
  });
});

// ─── GET /api/stats ─── Dashboard Stats ────────────────────────────────
app.get('/api/stats', (req, res) => {
  try {
    const db = getDb();
    const totalQueries = queryScalar(db, 'SELECT COUNT(*) FROM query_history');
    const successQueries = queryScalar(db, "SELECT COUNT(*) FROM query_history WHERE status = 'success'");
    const failedQueries = queryScalar(db, "SELECT COUNT(*) FROM query_history WHERE status = 'error'");
    const totalStudents = queryScalar(db, 'SELECT COUNT(*) FROM students');
    const { rows: tables } = queryToObjects(db, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'query_history'");
    const { rows: recentQueries } = queryToObjects(db, 'SELECT * FROM query_history ORDER BY executed_at DESC LIMIT 5');

    res.json({
      totalQueries,
      successQueries,
      failedQueries,
      successRate: totalQueries > 0 ? Math.round((successQueries / totalQueries) * 100) : 100,
      totalStudents,
      tableCount: tables.length,
      tables: tables.map(t => t.name),
      recentQueries
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Start Server ──────────────────────────────────────────────────────
async function start() {
  await initDatabase();
  seedDatabase();

  app.listen(PORT, () => {
    console.log(`\n  VelDB Server running on http://localhost:${PORT}`);
    console.log(`  POST /api/query     - Execute SQL`);
    console.log(`  GET  /api/history   - Query history`);
    console.log(`  POST /api/ai-query  - NL to SQL`);
    console.log(`  GET  /api/stats     - Dashboard stats\n`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
