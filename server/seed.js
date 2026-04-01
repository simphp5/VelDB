import { getDb, saveDb } from './db.js';

export function seedDatabase() {
  const db = getDb();

  // Create students table
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      dept TEXT NOT NULL,
      year INTEGER DEFAULT 1,
      gpa REAL DEFAULT 0.0
    )
  `);

  // Create query history table
  db.run(`
    CREATE TABLE IF NOT EXISTS query_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query_text TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'success',
      error_message TEXT,
      row_count INTEGER DEFAULT 0,
      executed_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Seed students only if table is empty
  const result = db.exec('SELECT COUNT(*) as count FROM students');
  const count = result[0]?.values[0][0] || 0;

  if (count === 0) {
    const students = [
      [1,  'Harini',  'CSE',   3, 9.1],
      [2,  'Rahul',   'IT',    2, 8.5],
      [3,  'Anu',     'ECE',   4, 8.9],
      [4,  'Karthik', 'EEE',   1, 7.8],
      [5,  'Priya',   'CSE',   3, 9.4],
      [6,  'Vignesh', 'MECH',  2, 7.2],
      [7,  'Sneha',   'IT',    4, 8.7],
      [8,  'Arjun',   'CIVIL', 1, 6.9],
      [9,  'Divya',   'ECE',   3, 9.0],
      [10, 'Suresh',  'CSE',   2, 8.3],
      [11, 'Meena',   'IT',    1, 7.6],
      [12, 'Ravi',    'MECH',  4, 8.1],
      [13, 'Kavya',   'EEE',   3, 9.2],
      [14, 'Manoj',   'CIVIL', 2, 7.0],
      [15, 'Pooja',   'CSE',   4, 8.8],
      [16, 'Ajay',    'ECE',   1, 7.5],
      [17, 'Nisha',   'IT',    3, 8.6],
      [18, 'Deepak',  'MECH',  2, 7.3],
      [19, 'Swathi',  'EEE',   4, 9.3],
      [20, 'Kiran',   'CSE',   1, 8.0],
    ];

    const stmt = db.prepare('INSERT INTO students (id, name, dept, year, gpa) VALUES (?, ?, ?, ?, ?)');
    for (const s of students) {
      stmt.run(s);
    }
    stmt.free();
    console.log('  Seeded 20 students');
  }

  saveDb();
  console.log('  Database initialized');
}
