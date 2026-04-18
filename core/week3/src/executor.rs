// src/executor.rs
// Manages the execution of SQL-like commands for VelDB.
// Week 4 adds a very small transaction layer (BEGIN / COMMIT / ROLLBACK).

// Integrate optimizer and join_engine logic
use crate::optimizer::choose_scan_strategy;
use crate::join_engine::{inner_join, Row};
use crate::transaction::TransactionManager;

pub struct Executor {
    txn_manager: TransactionManager,
}

impl Executor {
    pub fn new() -> Self {
        Executor {
            txn_manager: TransactionManager::new(),
        }
    }

    /// Primary execution flow routing
    pub fn execute_query(&mut self, query: &str) -> String {
        let query_upper = query.trim().to_uppercase();
        
        if query_upper.starts_with("BEGIN") {
            return self.txn_manager.begin();
        } else if query_upper.starts_with("COMMIT") {
            return self.txn_manager.commit();
        } else if query_upper.starts_with("ROLLBACK") {
            return self.txn_manager.rollback();
        } else if query_upper.starts_with("INSERT") {
            return self.execute_insert(query);
        } else if query_upper.starts_with("UPDATE") {
            return self.execute_update(query);
        } else if query_upper.starts_with("DELETE") {
            return self.execute_delete(query);
        } else if query_upper.starts_with("SELECT") {
            return self.execute_select(query);
        } else {
            "Error: Unsupported query type".to_string()
        }
    }

    /// Basic INSERT support for staging new rows.
    /// Ex: INSERT INTO customers VALUES (5, 'Bob', 'Paris');
    fn execute_insert(&mut self, query: &str) -> String {
        let tokens: Vec<&str> = query.split_whitespace().collect();
        if tokens.len() < 4 || tokens[1].to_uppercase() != "INTO" {
            return "Error: Invalid INSERT query format".to_string();
        }
        let table_name = tokens[2];

        // Everything after "VALUES" becomes the stored row.
        let values_part = match query.to_uppercase().find("VALUES") {
            Some(pos) => &query[pos + 6..],
            None => return "Error: INSERT must contain VALUES".to_string(),
        };
        let cleaned = values_part
            .trim()
            .trim_start_matches('(')
            .trim_end_matches(')')
            .trim_end_matches(';')
            .trim()
            .to_string();

        let mut rows = match self.txn_manager.load_for_insert(table_name) {
            Ok(r) => r,
            Err(e) => return e,
        };
        rows.push(cleaned);

        if self.txn_manager.is_active() {
            self.txn_manager.stage_table(table_name, rows);
            "1 row inserted (staged)".to_string()
        } else {
            if let Err(err) = TransactionManager::write_table_immediately(table_name, &rows) {
                return err;
            }
            "1 row inserted".to_string()
        }
    }

    /// Executing an UPDATE query
    /// Ex: UPDATE customers SET city = 'Chennai' WHERE customer_id = 1;
    fn execute_update(&mut self, query: &str) -> String {
        let tokens: Vec<&str> = query.split_whitespace().collect();
        if tokens.len() < 8 {
            return "Error: Invalid UPDATE query format".to_string();
        }

        let table_name = tokens[1];

        // Parse SET value and WHERE condition string
        let set_val = tokens[5].trim_matches('\'').trim_matches(';');
        let where_val = tokens.last().unwrap().trim_matches('\'').trim_matches(';');
        
        let rows = match self.txn_manager.get_or_stage_table(table_name) {
            Ok(r) => r,
            Err(e) => return e,
        };
        let mut updated_count = 0;

        // Read and modify rows
        let mut new_rows = Vec::new();
        for line in rows.into_iter() {
            if line.contains(where_val) {
                new_rows.push(format!("{} (MODIFIED: {})", line, set_val));
                updated_count += 1;
            } else {
                new_rows.push(line);
            }
        }

        if self.txn_manager.is_active() {
            self.txn_manager.stage_table(table_name, new_rows);
        } else if let Err(err) = TransactionManager::write_table_immediately(table_name, &new_rows) {
            return err;
        }

        format!("{} row(s) updated{}", updated_count, if self.txn_manager.is_active() { " (staged)" } else { "" })
    }

    /// Executing a DELETE query
    /// Ex: DELETE FROM customers WHERE customer_id = 3;
    fn execute_delete(&mut self, query: &str) -> String {
        let tokens: Vec<&str> = query.split_whitespace().collect();
        if tokens.len() < 5 {
            return "Error: Invalid DELETE query format".to_string();
        }

        let table_name = tokens[2];
        let where_val = tokens.last().unwrap().trim_matches('\'').trim_matches(';');
        
        let mut rows = match self.txn_manager.get_or_stage_table(table_name) {
            Ok(r) => r,
            Err(e) => return e,
        };
        let original_len = rows.len();

        rows.retain(|line| !line.contains(where_val));
        let deleted_count = original_len.saturating_sub(rows.len());

        if self.txn_manager.is_active() {
            self.txn_manager.stage_table(table_name, rows);
        } else if let Err(err) = TransactionManager::write_table_immediately(table_name, &rows) {
            return err;
        }

        format!("{} row(s) deleted{}", deleted_count, if self.txn_manager.is_active() { " (staged)" } else { "" })
    }

    /// Execute SELECT flow adhering strictly to: SELECT -> WHERE -> JOIN -> ORDER BY -> LIMIT
    fn execute_select(&mut self, query: &str) -> String {
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

        let mut rows: Vec<Row> = match self.txn_manager.read_current_rows(table_name) {
            Ok(r) => r,
            Err(e) => return e,
        };

        // [STEP 1] WHERE filtering
        if let Some(val) = where_val {
            rows.retain(|line| line.contains(val));
        }

        // [STEP 2] INNER JOIN invocation uses staged data when present
        if !join_table.is_empty() {
            let join_rows = match self.txn_manager.read_current_rows(join_table) {
                Ok(r) => r,
                Err(e) => return e,
            };
            rows = inner_join(&rows, &join_rows);
        }

        // [STEP 3] Apply ORDER BY sorting dynamically
        if has_order_by {
            rows.sort(); 
            if order_by_desc {
                rows.reverse();
            }
        }

        // [STEP 4] Apply LIMIT processing after sorting evaluation
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
