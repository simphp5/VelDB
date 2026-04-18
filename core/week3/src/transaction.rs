// src/transaction.rs
// A tiny transaction manager used by VelDB's week 4 exercises.
// It keeps a simple in-memory staging area per table and only
// writes to disk when COMMIT is called.

use std::collections::HashMap;
use std::fs::{File, OpenOptions};
use std::io::{BufRead, BufReader, Write};

pub struct TransactionManager {
    active: bool,
    staged_tables: HashMap<String, Vec<String>>,
}

impl TransactionManager {
    pub fn new() -> Self {
        TransactionManager {
            active: false,
            staged_tables: HashMap::new(),
        }
    }

    pub fn begin(&mut self) -> String {
        if self.active {
            return "Error: A transaction is already active (nested transactions not supported)".to_string();
        }
        self.active = true;
        self.staged_tables.clear();
        "Transaction started".to_string()
    }

    pub fn commit(&mut self) -> String {
        if !self.active {
            return "Error: No active transaction to commit".to_string();
        }

        for (table, rows) in &self.staged_tables {
            if let Err(err) = Self::write_table_to_disk(table, rows) {
                return format!("Error committing '{}': {}", table, err);
            }
        }

        self.staged_tables.clear();
        self.active = false;
        "Transaction committed".to_string()
    }

    pub fn rollback(&mut self) -> String {
        if !self.active {
            return "Error: No active transaction to roll back".to_string();
        }
        self.staged_tables.clear();
        self.active = false;
        "Transaction rolled back".to_string()
    }

    pub fn is_active(&self) -> bool {
        self.active
    }

    /// Used by UPDATE/DELETE to grab the current working copy.
    /// When a transaction is active we load once and keep the staged copy.
    pub fn get_or_stage_table(&mut self, table: &str) -> Result<Vec<String>, String> {
        if self.active {
            if let Some(rows) = self.staged_tables.get(table) {
                return Ok(rows.clone());
            }

            let rows = Self::read_table_from_disk(table)?;
            self.staged_tables.insert(table.to_string(), rows.clone());
            Ok(rows)
        } else {
            Self::read_table_from_disk(table)
        }
    }

    /// Used by INSERT where the table may not yet exist.
    pub fn load_for_insert(&mut self, table: &str) -> Result<Vec<String>, String> {
        if self.active {
            if let Some(rows) = self.staged_tables.get(table) {
                return Ok(rows.clone());
            }
            // If the file is missing, we start with an empty table in-memory.
            let rows = Self::read_table_from_disk(table).unwrap_or_else(|_| Vec::new());
            self.staged_tables.insert(table.to_string(), rows.clone());
            Ok(rows)
        } else {
            Ok(Self::read_table_from_disk(table).unwrap_or_else(|_| Vec::new()))
        }
    }

    /// Reading helper that prefers staged data when present.
    pub fn read_current_rows(&self, table: &str) -> Result<Vec<String>, String> {
        if self.active {
            if let Some(rows) = self.staged_tables.get(table) {
                return Ok(rows.clone());
            }
        }
        Self::read_table_from_disk(table)
    }

    pub fn stage_table(&mut self, table: &str, rows: Vec<String>) {
        if self.active {
            self.staged_tables.insert(table.to_string(), rows);
        }
    }

    pub fn write_table_immediately(table: &str, rows: &[String]) -> Result<(), String> {
        Self::write_table_to_disk(table, rows)
    }

    fn read_table_from_disk(table: &str) -> Result<Vec<String>, String> {
        let path = format!("{}.vdb", table);
        let file = File::open(&path).map_err(|_| format!("Error: Table '{}' not found", table))?;
        let reader = BufReader::new(file);
        Ok(reader.lines().flatten().collect())
    }

    fn write_table_to_disk(table: &str, rows: &[String]) -> Result<(), String> {
        let path = format!("{}.vdb", table);
        let mut file = OpenOptions::new()
            .write(true)
            .truncate(true)
            .create(true)
            .open(&path)
            .map_err(|e| format!("Error writing table '{}': {}", table, e))?;

        for row in rows {
            writeln!(file, "{}", row).map_err(|e| format!("Error writing table '{}': {}", table, e))?;
        }
        Ok(())
    }
}
