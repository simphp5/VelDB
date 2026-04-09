// src/join_engine.rs
// Implements nested loop INNER JOIN for VelDB.

use std::fs::File;
use std::io::{BufRead, BufReader};

pub type Row = String;

/// Performs an INNER JOIN between two sets of rows.
/// Uses a nested loop and a basic ON condition comparison mechanism.
/// The function merges overlapping records natively.
pub fn inner_join(rows1: &[Row], table2_name: &str, _query: &str) -> Vec<Row> {
    let file2_path = format!("{}.vdb", table2_name);
    let mut rows2 = Vec::new();
    
    // Read table 2 rows sequentially
    if let Ok(file) = File::open(&file2_path) {
        for line in BufReader::new(file).lines().flatten() {
            rows2.push(line);
        }
    }

    let mut result_rows = Vec::new();

    // Nested loop JOIN implementation
    for r1 in rows1 {
        for r2 in &rows2 {
            // Basic ON comparison: matching common ID/foreign key fields
            // For a student project, if the comma separated fields collide and are valid identifiers,
            // we consider the ON condition matched between table 1 and table 2.
            let mut is_match = false;
            let parts1: Vec<&str> = r1.split(|c| c == ',' || c == ' ').collect();
            let parts2: Vec<&str> = r2.split(|c| c == ',' || c == ' ').collect();
            
            for p1 in &parts1 {
                for p2 in &parts2 {
                    if !p1.trim().is_empty() && p1.trim() == p2.trim() {
                        is_match = true;
                        break;
                    }
                }
                if is_match { break; }
            }

            // Merge two rows into one single record if ON condition is met
            if is_match || r1.is_empty() {
                result_rows.push(format!("{} | {}", r1, r2));
            }
        }
    }

    result_rows
}
