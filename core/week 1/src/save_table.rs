use crate::product_table::Table;
use crate::variables::TABLE_FILE;
use std::fs;
use serde_json;

pub fn save(table: &Table) -> std::io::Result<()> {
    let json = serde_json::to_string_pretty(table)?;
    fs::write(TABLE_FILE, json)?;
    Ok(())
}

