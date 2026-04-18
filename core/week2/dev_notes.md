# Developer Notes: DB Core Engine (Week 2)

## Architectural Overview
VelDB is shifting from basic CLI functionality to foundational DBMS operations. The implementation includes query execution, schema validation, and simple indexing.

### Core Modules
#### 1. Executor (`core/query_engine/executor.rs`)
- **Query Controller**: Processes parsed abstract syntax structures (e.g., `InsertStmt`, `SelectStmt`) simulating real output from `parser.rs`.
- **Validation**: Enforces datatypes (`DataType::Int`, `Float`, `Text`) defined in a simulated `Schema` struct before writing strings dynamically.
- **Storage Management**: Appends data strings formatted as pipe-delimited (`|`) values to a `.vdb` plain text file. `execute_insert` relies on `file.seek(SeekFrom::End(0))` to record initial file pointer positions into the `IndexManager`.
- **Projections & Table Formatting**: Evaluates and restricts output bounds based on user-selected columns. `format_ascii_table` calculates max string widths to print a dynamically aligned CLI data table.

#### 2. IndexManager (`core/storage/index_manager.rs`)
- **In-Memory Store**: A multi-level HashMap mapping string allocations logically like `table_name -> column_name -> value -> Vec<offsets>`.
- **Optimization Strategy**: Replaces a complete sequential `BufReader::read_line` over files with an exact positional seek (`file.seek(SeekFrom::Start(offset))`) upon queries containing explicit `WHERE col_name = value`.

### Future Trade-offs & Iterations
- The index is currently volatile. If VelDB stops or crashes, a full re-initialization routine scanning the `.vdb` files will be needed during startup to rebuild the indexes. Next phases should consider persisting these indexes separately.
- Index lookup only triggers on `=` operations. Query executions using `<=`, `<`, or `> ` fall back on the original Sequential Scan loop inside the Executor. To optimize constraints smoothly, building a simple B-Tree instead of a basic HashMap might be essential down the line.
