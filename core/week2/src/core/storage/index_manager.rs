use std::collections::HashMap;

/// IndexManager: Handles basic indexing.
/// Maps table_name -> column_name -> (value -> row_offsets)
pub struct IndexManager {
    // Top-level map config.
    // Example: "employees" -> ("id" -> ("10" -> [0, 50, 100]))
    indexes: HashMap<String, HashMap<String, HashMap<String, Vec<u64>>>>,
}

impl IndexManager {
    /// new() -> Handles initialization
    pub fn new() -> Self {
        IndexManager {
            indexes: HashMap::new(),
        }
    }

    /// insert_entry() -> update index on INSERT
    pub fn insert_entry(&mut self, table_name: &str, col_name: &str, value: &str, offset: u64) {
        let table_indexes = self.indexes
            .entry(table_name.to_string())
            .or_insert_with(HashMap::new);

        let col_index = table_indexes
            .entry(col_name.to_string())
            .or_insert_with(HashMap::new);

        col_index
            .entry(value.to_string())
            .or_insert_with(Vec::new)
            .push(offset);
    }

    /// find_offsets() -> Retrieves list of offsets for a specific value in a column
    pub fn find_offsets(&self, table_name: &str, col_name: &str, value: &str) -> Option<Vec<u64>> {
        if let Some(table_indexes) = self.indexes.get(table_name) {
            if let Some(col_index) = table_indexes.get(col_name) {
                if let Some(offsets) = col_index.get(value) {
                    return Some(offsets.clone());
                }
            }
        }
        None
    }
}
