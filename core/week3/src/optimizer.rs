// src/optimizer.rs
// Contains stubs for VelDB's query optimization logic.

/// Determines the optimal scan strategy based on index availability.
pub fn choose_scan_strategy(has_index: bool) -> String {
    if has_index {
        "INDEX_SCAN".to_string()
    } else {
        "FULL_SCAN".to_string()
    }
}
