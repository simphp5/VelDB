// src/executor.rs
// Manages the execution of SQL-like commands for VelDB.

use std::fs::{File, OpenOptions};
use std::io::{BufRead, BufReader, Write};

// Integrate optimizer and join_engine logic
use crate::optimizer::choose_scan_strategy;
use crate::join_engine::{inner_join, Row};

pub struct Executor;

impl Executor {
    pub fn new() -> Self {
        Executor
    }

    /// Primary execution flow routing
    pub fn execute_query(&self, query: &str) -> String {
        let query_upper = query.trim().to_uppercase();
        
        if query_upper.starts_with("UPDATE") {
            self.execute_update(query)
        } else if query_upper.starts_with("DELETE") {
            self.execute_delete(query)
        } else if query_upper.starts_with("SELECT") {
            self.execute_select(query)
        } else {
            "Error: Unsupported query type".to_string()
        }
    }

    /// Executing an UPDATE query
    /// Ex: UPDATE customers SET city = 'Chennai' WHERE customer_id = 1;
    fn execute_update(&self, query: &str) -> String {
        let tokens: Vec<&str> = query.split_whitespace().collect();
        if tokens.len() < 8 {
            return "Error: Invalid UPDATE query format".to_string();
        }

        let table_name = tokens[1];
        let file_path = format!("{}.vdb", table_name);

        // Parse SET value and WHERE condition string
        let set_val = tokens[5].trim_matches('\'').trim_matches(';');
        let where_val = tokens.last().unwrap().trim_matches('\'').trim_matches(';');
        
        let mut rows = Vec::new();
        let mut updated_count = 0;

        // Read and modify rows
        if let Ok(file) = File::open(&file_path) {
            let reader = BufReader::new(file);
            for line in reader.lines().flatten() {
                if line.contains(where_val) {
                    rows.push(format!("{} (MODIFIED: {})", line, set_val));
                    updated_count += 1;
                } else {
                    rows.push(line);
                }
            }
        } else {
            return format!("Error: Table '{}' not found", table_name);
        }

        // Rewrite file with modified rows intact
        if let Ok(mut file) = OpenOptions::new().write(true).truncate(true).create(false).open(&file_path) {
            for row in rows {
                let _ = writeln!(file, "{}", row);
            }
        }

        format!("{} row(s) updated", updated_count)
    }

    /// Executing a DELETE query
    /// Ex: DELETE FROM customers WHERE customer_id = 3;
    fn execute_delete(&self, query: &str) -> String {
        let tokens: Vec<&str> = query.split_whitespace().collect();
        if tokens.len() < 5 {
            return "Error: Invalid DELETE query format".to_string();
        }

        let table_name = tokens[2];
        let file_path = format!("{}.vdb", table_name);
        let where_val = tokens.last().unwrap().trim_matches('\'').trim_matches(';');
        
        let mut rows = Vec::new();
        let mut deleted_count = 0;

        // Parse and skip matching rows
        if let Ok(file) = File::open(&file_path) {
            let reader = BufReader::new(file);
            for line in reader.lines().flatten() {
                if line.contains(where_val) {
                    deleted_count += 1; // Removed row
                } else {
                    rows.push(line);
                }
            }
        } else {
            return format!("Error: Table '{}' not found", table_name);
        }

        // Rewrite file exclusively housing continuing rows
        if let Ok(mut file) = OpenOptions::new().write(true).truncate(true).create(false).open(&file_path) {
            for row in rows {
                let _ = writeln!(file, "{}", row);
            }
        }

        format!("{} row(s) deleted", deleted_count)
    }

    /// Execute SELECT flow adhering strictly to: SELECT -> WHERE -> JOIN -> ORDER BY -> LIMIT
    fn execute_select(&self, query: &str) -> String {
        let tokens: Vec<&str> = query.split_whitespace().collect();
        let mut table_name = "";
        let mut join_table = "";
        
        // Output optimizer check dynamically
        let strategy = choose_scan_strategy(false);
        println!("DEBUG: [Optimizer] Choosing scan strategy for SELECT: {}", strategy);

        let mut order_by_desc = false;
        let mut has_order_by = false;
        let mut limit = None;
        let mut where_val = None;

        let mut i = 0;
        while i < tokens.len() {
            let token = tokens[i].to_uppercase();
            if token == "FROM" && i + 1 < tokens.len() {
                table_name = tokens[i+1];
            } else if token == "JOIN" && i + 1 < tokens.len() {
                join_table = tokens[i+1];
            } else if token == "WHERE" && i + 3 < tokens.len() {
                where_val = Some(tokens[i+3].trim_matches('\'').trim_matches(';'));
            } else if token == "ORDER" && i + 2 < tokens.len() {
                has_order_by = true;
                if i + 3 < tokens.len() && tokens[i+3].to_uppercase().starts_with("DESC") {
                    order_by_desc = true;
                }
            } else if token == "LIMIT" && i + 1 < tokens.len() {
                limit = tokens[i+1].trim_matches(';').parse::<usize>().ok();
            }
            i += 1;
        }

        let file_path = format!("{}.vdb", table_name);
        let mut rows: Vec<Row> = Vec::new();

        // [STEP 1] Read base query and [STEP 2] Process WHERE filters
        if let Ok(file) = File::open(&file_path) {
            let reader = BufReader::new(file);
            for line in reader.lines().flatten() {
                if let Some(val) = where_val {
                    if !line.contains(val) {
                        continue;
                    }
                }
                rows.push(line);
            }
        }

        // [STEP 3] INNER JOIN invocation natively
        if !join_table.is_empty() {
            rows = inner_join(&rows, join_table, query);
        }

        // [STEP 4] Apply ORDER BY sorting dynamically
        if has_order_by {
            rows.sort(); 
            if order_by_desc {
                rows.reverse();
            }
        }

        // [STEP 5] Apply LIMIT processing after sorting evaluation
        if let Some(n) = limit {
            rows.truncate(n);
        }

        if rows.is_empty() {
            "0 rows found".to_string()
        } else {
            rows.join("\n")
        }
    }
}
