mod core;

use crate::core::storage::file_storage::Row;
use crate::core::transaction::manager::TransactionManager;
use std::fs;

fn print_table(title: &str, rows: &[Row]) {
    println!("\n=== {} ===", title);
    if rows.is_empty() {
        println!("(Empty table)");
    } else {
        for row in rows {
            println!("ID: {}, Name: {}, Salary: {}", row.id, row.name, row.salary);
        }
    }
    println!("===============\n");
}

fn main() {
    let db_file = "employees.tbl";
    // Clean up file if it exists so the demo runs fresh every time.
    let _ = fs::remove_file(db_file);

    println!("Initializing VelDB Transaction Manager...");
    let mut tm = TransactionManager::new(db_file);

    // Initial state
    print_table("Initial Data", &tm.select_rows());

    // Basic insertion outside transaction
    println!("Inserting data directly to disk (No active tx)...");
    let _ = tm.insert_row(Row { id: 1, name: "Alice".to_string(), salary: 50000 });
    let _ = tm.insert_row(Row { id: 2, name: "Bob".to_string(), salary: 60000 });
    
    print_table("Data after direct insert", &tm.select_rows());

    // Demo: BEGIN, INSERT, UPDATE, DELETE, ROLLBACK
    println!("--- Starting ROLLBACK Demo ---");
    if let Err(e) = tm.begin() {
        println!("Error: {}", e);
    }
    
    let _ = tm.insert_row(Row { id: 3, name: "Charlie".to_string(), salary: 70000 });
    let _ = tm.update_row(1, "Alice Smith", 55000);
    let _ = tm.delete_row(2);

    print_table("Data DURING Transaction (Staged)", &tm.select_rows());

    if let Err(e) = tm.rollback() {
        println!("Error: {}", e);
    }

    print_table("Data AFTER Rollback (Charlie not saved, Alice unchanged, Bob returns)", &tm.select_rows());

    // Demo: BEGIN, INSERT, UPDATE, COMMIT
    println!("--- Starting COMMIT Demo ---");
    if let Err(e) = tm.begin() {
        println!("Error: {}", e);
    }

    let _ = tm.insert_row(Row { id: 4, name: "David".to_string(), salary: 45000 });
    let _ = tm.update_row(2, "Robert", 65000);

    print_table("Data DURING Transaction (Staged)", &tm.select_rows());

    if let Err(e) = tm.commit() {
        println!("Error: {}", e);
    }

    print_table("Data AFTER Commit (Staged changes persisted)", &tm.select_rows());
    
    // Check error handling
    println!("--- Testing Error Handling ---");
    if let Err(e) = tm.commit() {
        println!("Expected Error (Commit without Begin): {}", e);
    }
    if let Err(e) = tm.rollback() {
        println!("Expected Error (Rollback without Begin): {}", e);
    }
    let _ = tm.begin();
    if let Err(e) = tm.begin() {
        println!("Expected Error (Begin already active): {}", e);
    }
    let _ = tm.rollback();
}
