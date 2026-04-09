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

  // Create saved queries table
  db.run(`
    CREATE TABLE IF NOT EXISTS saved_queries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      query_text TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
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

  // Create products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0
    )
  `);

  // Create customers table
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      join_date TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      order_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `);

  // Seed products
  const productCount = db.exec('SELECT COUNT(*) as count FROM products')[0]?.values[0][0] || 0;
  if (productCount === 0) {
    const products = [
      ['Laptop', 'Electronics', 999.99, 50],
      ['Smartphone', 'Electronics', 699.99, 150],
      ['Desk Chair', 'Furniture', 149.99, 200],
      ['Coffee Maker', 'Appliances', 89.99, 75],
      ['Headphones', 'Electronics', 199.99, 120]
    ];
    const stmt = db.prepare('INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)');
    for (const p of products) stmt.run(p);
    stmt.free();
  }

  // Seed customers
  const customerCount = db.exec('SELECT COUNT(*) as count FROM customers')[0]?.values[0][0] || 0;
  if (customerCount === 0) {
    const customers = [
      ['Alice Smith', 'alice@example.com'],
      ['Bob Jones', 'bob@example.com'],
      ['Charlie Brown', 'charlie@example.com']
    ];
    const stmt = db.prepare('INSERT INTO customers (name, email) VALUES (?, ?)');
    for (const c of customers) stmt.run(c);
    stmt.free();
  }

  // Seed orders
  const orderCount = db.exec('SELECT COUNT(*) as count FROM orders')[0]?.values[0][0] || 0;
  if (orderCount === 0) {
    const orders = [
      [1, 999.99, 'completed'],
      [1, 199.99, 'pending'],
      [2, 149.99, 'shipped'],
      [3, 89.99, 'completed']
    ];
    const stmt = db.prepare('INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?)');
    for (const o of orders) stmt.run(o);
    stmt.free();
  }

  saveDb();
  console.log('  Database initialized');
}
