use std::collections::HashMap;
use std::fs::{File, OpenOptions};
use std::io::{BufRead, BufReader, Seek, SeekFrom, Write};

use crate::core::storage::index_manager::IndexManager;

// =====================================================================
// Parsed Query Structures (Mocking what parser.rs returns)
// Use the actual structures from parser.rs in the final project.
// =====================================================================

#[derive(Debug, Clone)]
pub enum Query {
    Insert(InsertStmt),
    Select(SelectStmt),
}

#[derive(Debug, Clone)]
pub struct InsertStmt {
    pub table_name: String,
    pub values: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct SelectStmt {
    pub table_name: String,
    pub columns: Vec<String>, // Empty or ["*"] means SELECT *
    pub where_clause: Option<WhereClause>,
}

#[derive(Debug, Clone)]
pub struct WhereClause {
    pub col_name: String,
    pub operator: String, // e.g. "=", "!=", ">", "<", ">=", "<="
    pub value: String,
}

// =====================================================================
// Schema Definitions
// =====================================================================

#[derive(Debug, Clone, PartialEq)]
pub enum DataType {
    Int,
    Float,
    Text,
}

#[derive(Debug, Clone)]
pub struct ColumnDef {
    pub name: String,
    pub data_type: DataType,
}

#[derive(Debug, Clone)]
pub struct Schema {
    pub columns: Vec<ColumnDef>,
}

// =====================================================================
// Execution Engine Start
// =====================================================================

pub struct Executor {
    pub db_dir: String,
    pub schemas: HashMap<String, Schema>,
    pub index_manager: IndexManager,
}

impl Executor {
    /// new() -> Initialize executor with a directory for .vdb files
    pub fn new(db_dir: String) -> Self {
        Executor {
            db_dir,
            schemas: HashMap::new(),
            index_manager: IndexManager::new(),
        }
    }

    /// Register a table schema
    pub fn add_schema(&mut self, table_name: &str, schema: Schema) {
        self.schemas.insert(table_name.to_string(), schema);
    }

    /// execute_query() -> Main entry point for query execution
    pub fn execute_query(&mut self, query: Query) -> Result<String, String> {
        match query {
            Query::Insert(stmt) => self.execute_insert(stmt),
            Query::Select(stmt) => self.execute_select(stmt),
        }
    }

    /// execute_insert() -> Validates types, appends row to file, updates index
    fn execute_insert(&mut self, stmt: InsertStmt) -> Result<String, String> {
        let schema = self.schemas.get(&stmt.table_name)
            .ok_or(format!("Schema not found for table: {}", stmt.table_name))?;

        if stmt.values.len() != schema.columns.len() {
            return Err(format!("Column count mismatch: expected {}, got {}", schema.columns.len(), stmt.values.len()));
        }

        // Validate data types based on schema
        for (i, val) in stmt.values.iter().enumerate() {
            let col_def = &schema.columns[i];
            match col_def.data_type {
                DataType::Int => {
                    val.parse::<i64>().map_err(|_| format!("Type mismatch: {} is not a valid INT", val))?;
                }
                DataType::Float => {
                    val.parse::<f64>().map_err(|_| format!("Type mismatch: {} is not a valid FLOAT", val))?;
                }
                DataType::Text => {
                    // Everything is valid TEXT
                }
            }
        }

        // Open Table file for append
        let file_path = format!("{}/{}.vdb", self.db_dir, stmt.table_name);
        let mut file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&file_path)
            .map_err(|e| format!("Failed to open table file: {}", e))?;

        // Before appending, find the current offset for index updating
        let offset = file.seek(SeekFrom::End(0)).unwrap_or(0);

        let row_str = stmt.values.join("|");
        writeln!(file, "{}", row_str).map_err(|e| format!("Failed to write row: {}", e))?;

        // Update index (only supporting strings for generic indexing purposes)
        for (i, val) in stmt.values.iter().enumerate() {
            let col_name = &schema.columns[i].name;
            self.index_manager.insert_entry(&stmt.table_name, col_name, val, offset);
        }

        Ok("1 row inserted.".to_string())
    }

    /// execute_select() -> Uses index or full scan, filters, projects, and formats ASCII table
    fn execute_select(&self, stmt: SelectStmt) -> Result<String, String> {
        let schema = self.schemas.get(&stmt.table_name)
            .ok_or(format!("Schema not found for table: {}", stmt.table_name))?;

        let file_path = format!("{}/{}.vdb", self.db_dir, stmt.table_name);
        
        let file_res = File::open(&file_path);
        if file_res.is_err() {
            return Err(format!("Table file missing or unreadable: {}", file_path));
        }
        let file = file_res.unwrap();
        
        let reader = BufReader::new(file);

        let mut qualifying_rows = Vec::new();

        // Check if we can use an index optimization
        let mut index_offsets = None;
        if let Some(ref w) = stmt.where_clause {
            if w.operator == "=" {
                if let Some(offsets) = self.index_manager.find_offsets(&stmt.table_name, &w.col_name, &w.value) {
                    index_offsets = Some(offsets);
                }
            }
        }

        if let Some(offsets) = index_offsets {
            // =========================
            // INDEX SCAN
            // =========================
            if let Ok(mut rand_file) = File::open(&file_path) {
                for offset in offsets {
                    if rand_file.seek(SeekFrom::Start(offset)).is_ok() {
                        let mut line = String::new();
                        let mut br = BufReader::new(&rand_file);
                        if br.read_line(&mut line).unwrap_or(0) > 0 {
                            let fields: Vec<String> = line.trim_end().split('|').map(|s| s.to_string()).collect();
                            if self.apply_where(&fields, &stmt.where_clause, schema)? {
                                qualifying_rows.push(fields);
                            }
                        }
                    }
                }
            }
        } else {
            // =========================
            // FULL TABLE SCAN
            // =========================
            for line_res in reader.lines() {
                if let Ok(line) = line_res {
                    let fields: Vec<String> = line.split('|').map(|s| s.to_string()).collect();
                    if self.apply_where(&fields, &stmt.where_clause, schema)? {
                        qualifying_rows.push(fields);
                    }
                }
            }
        }

        // Project columns
        let projected = self.project_columns(&qualifying_rows, &stmt.columns, schema)?;
        
        // Determine Headers for rendering
        let headers: Vec<String> = if stmt.columns.is_empty() || stmt.columns.contains(&"*".to_string()) {
            schema.columns.iter().map(|c| c.name.clone()).collect()
        } else {
            stmt.columns.clone()
        };

        if projected.is_empty() {
            return Ok("0 rows returned.".to_string());
        }

        Ok(self.format_ascii_table(&headers, &projected))
    }

    /// apply_where() -> Type-aware comparison for filtering
    fn apply_where(&self, row: &[String], where_clause: &Option<WhereClause>, schema: &Schema) -> Result<bool, String> {
        let w = match where_clause {
            Some(clause) => clause,
            None => return Ok(true), // No WHERE clause => all rows qualify
        };

        let col_idx = schema.columns.iter().position(|c| c.name == w.col_name)
            .ok_or(format!("Column not found in schema: {}", w.col_name))?;

        if row.len() <= col_idx {
            return Err("Malformed row data.".to_string());
        }

        let row_val = &row[col_idx];
        let col_type = &schema.columns[col_idx].data_type;

        match col_type {
            DataType::Int => {
                let a = row_val.parse::<i64>().unwrap_or(0);
                let b = w.value.parse::<i64>().unwrap_or(0);
                match w.operator.as_str() {
                    "=" => Ok(a == b), "!=" => Ok(a != b),
                    ">" => Ok(a > b), "<" => Ok(a < b),
                    ">=" => Ok(a >= b), "<=" => Ok(a <= b),
                    _ => Err(format!("Unsupported operator: {}", w.operator))
                }
            }
            DataType::Float => {
                let a = row_val.parse::<f64>().unwrap_or(0.0);
                let b = w.value.parse::<f64>().unwrap_or(0.0);
                match w.operator.as_str() {
                    "=" => Ok(a == b), "!=" => Ok(a != b),
                    ">" => Ok(a > b), "<" => Ok(a < b),
                    ">=" => Ok(a >= b), "<=" => Ok(a <= b),
                    _ => Err(format!("Unsupported operator: {}", w.operator))
                }
            }
            DataType::Text => {
                let a = row_val.as_str();
                let b = w.value.as_str();
                match w.operator.as_str() {
                    "=" => Ok(a == b), "!=" => Ok(a != b),
                    ">" => Ok(a > b), "<" => Ok(a < b),
                    ">=" => Ok(a >= b), "<=" => Ok(a <= b),
                    _ => Err(format!("Unsupported operator: {}", w.operator))
                }
            }
        }
    }

    /// project_columns() -> Extract only requested columns
    fn project_columns(&self, rows: &[Vec<String>], req_cols: &[String], schema: &Schema) -> Result<Vec<Vec<String>>, String> {
        if req_cols.is_empty() || req_cols.contains(&"*".to_string()) {
            return Ok(rows.to_vec());
        }

        let mut indices = Vec::new();
        for rc in req_cols {
            if let Some(idx) = schema.columns.iter().position(|c| c.name == *rc) {
                indices.push(idx);
            } else {
                return Err(format!("Requested column not in schema: {}", rc));
            }
        }

        let mut projected_rows = Vec::new();
        for row in rows {
            let mut new_row = Vec::new();
            for &idx in &indices {
                if idx < row.len() {
                    new_row.push(row[idx].clone());
                } else {
                    new_row.push("NULL".to_string());
                }
            }
            projected_rows.push(new_row);
        }

        Ok(projected_rows)
    }

    /// format_ascii_table() -> Display output in nice format
    fn format_ascii_table(&self, headers: &[String], rows: &[Vec<String>]) -> String {
        let mut col_widths: Vec<usize> = headers.iter().map(|h| h.len()).collect();

        // Calculate maximum required width for each column
        for row in rows {
            for (i, val) in row.iter().enumerate() {
                if i < col_widths.len() && val.len() > col_widths[i] {
                    col_widths[i] = val.len();
                }
            }
        }

        let mut table = String::new();

        // Function to create standard separator line `+---+---+`
        let make_separator = |widths: &[usize]| -> String {
            let mut s = String::from("+");
            for w in widths {
                s.push_str(&"-".repeat(*w + 2));
                s.push('+');
            }
            s.push('\n');
            s
        };

        let sep = make_separator(&col_widths);

        // Header section
        table.push_str(&sep);
        table.push('|');
        for (i, h) in headers.iter().enumerate() {
            table.push_str(&format!(" {:<width$} |", h, width = col_widths[i]));
        }
        table.push('\n');
        table.push_str(&sep);

        // Rows section
        for row in rows {
            table.push('|');
            for (i, val) in row.iter().enumerate() {
                if i < col_widths.len() {
                    table.push_str(&format!(" {:<width$} |", val, width = col_widths[i]));
                }
            }
            table.push('\n');
        }

        if !rows.is_empty() {
            table.push_str(&sep);
        }

        table
    }
}
