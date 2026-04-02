pub mod core;

use crate::core::query_engine::executor::{
    Executor, Query, InsertStmt, SelectStmt, WhereClause, Schema, ColumnDef, DataType
};

fn main() {
    println!("=== VelDB Week 2 Engine Demo ===");
    
    // 1. Initialize Executor with the current directory
    let mut executor = Executor::new(".".to_string());
    
    // 2. Setup the Schema for the "employees" table
    let schema = Schema {
        columns: vec![
            ColumnDef { name: "id".to_string(), data_type: DataType::Int },
            ColumnDef { name: "name".to_string(), data_type: DataType::Text },
            ColumnDef { name: "salary".to_string(), data_type: DataType::Float },
        ]
    };
    executor.add_schema("employees", schema);

    // Provide queries representing parsed query trees
    let queries = vec![
        // INSERT statements
        Query::Insert(InsertStmt {
            table_name: "employees".to_string(),
            values: vec!["1".to_string(), "Ravi".to_string(), "45000.5".to_string()],
        }),
        Query::Insert(InsertStmt {
            table_name: "employees".to_string(),
            values: vec!["2".to_string(), "Sunil".to_string(), "50000.0".to_string()],
        }),
        Query::Insert(InsertStmt {
            table_name: "employees".to_string(),
            values: vec!["3".to_string(), "Priya".to_string(), "65000.0".to_string()],
        }),
        Query::Insert(InsertStmt {
            table_name: "employees".to_string(),
            values: vec!["4".to_string(), "Arun".to_string(), "30000.0".to_string()],
        }),

        // SELECT * (Empty columns list defaults to all)
        Query::Select(SelectStmt {
            table_name: "employees".to_string(),
            columns: vec![],
            where_clause: None,
        }),

        // SELECT specific columns (Projection)
        Query::Select(SelectStmt {
            table_name: "employees".to_string(),
            columns: vec!["name".to_string(), "salary".to_string()],
            where_clause: None,
        }),

        // Index-Optimized WHERE (id = 2)
        Query::Select(SelectStmt {
            table_name: "employees".to_string(),
            columns: vec![],
            where_clause: Some(WhereClause {
                col_name: "id".to_string(),
                operator: "=".to_string(),
                value: "2".to_string(),
            }),
        }),

        // Filter Check (salary > 40000.0) -> Fallback to sequential filter execution
        Query::Select(SelectStmt {
            table_name: "employees".to_string(),
            columns: vec!["name".to_string()],
            where_clause: Some(WhereClause {
                col_name: "salary".to_string(),
                operator: ">".to_string(),
                value: "40000.0".to_string(),
            }),
        }),
    ];

    // Delete existing .vdb file if we want a fresh run
    let _ = std::fs::remove_file("employees.vdb");

    for q in queries {
        println!("\nExecuting Query: {:?}", q);
        match executor.execute_query(q) {
            Ok(result) => println!("Result:\n{}", result),
            Err(e) => println!("Error: {}", e),
        }
    }
}
