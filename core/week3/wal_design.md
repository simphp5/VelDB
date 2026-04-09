# Write-Ahead Logging (WAL) Design Sketch

## 1. What is WAL?
Write-Ahead Logging (WAL) is a foundational recovery technique utilized by modern database engines (like VelDB) to guarantee atomic data integrity. Instead of modifying actual database tables immediately and risking partial failure, incoming transaction payloads are securely appended to an isolated sequential log file on disk beforehand.

## 2. Why is WAL Needed?
- **Durability assurance:** Ensures changes are permanently saved into physical records before updating the main database structures.
- **Data corruption prevention:** If the host system crashes midway through a file write, the original database file is protected.
- **Rollback capabilities:** Uncommitted operations can be cleanly aborted without affecting cross-table consistency matrices.

## 3. Example Log Entry
A standard physical trace embedded within a `.log` file structure looks natively like this:
```text
[TxID: 1042] [START]
[TxID: 1042] [UPDATE] [Table: customers] [Row: 1] [Set: 'Chennai']
[TxID: 1042] [COMMIT]
```

## 4. Operational Flow
The runtime process executes operations efficiently during active memory transactions:
1. **Write to WAL:** Once VelDB receives an actionable `UPDATE/DELETE/INSERT`, it immediately writes string intents into `veldb.wal`.
2. **Apply to DB:** Upon safely acknowledging storage rules recursively, VelDB executes modifying data structures mapping locally inside `.vdb` files safely.
3. **Mark committed:** Finally, the successful query resolves, appending an immutable `[COMMIT]` action validating lifecycle termination.

## 5. Future Scope
- **Crash Recovery:** If physical node memory terminates gracefully, reboot sequence mechanisms scan WAL layers finding outstanding queries mapping properly discarding bad fragments natively. 
- **Rollback Integration:** Provide dynamic query engines allowing structural UNDO logs backing out mapped operations automatically through commands like `ROLLBACK;`.
- **Multi-Threading Transactions:** Extending WAL metadata components mapping nested local row locks tracking concurrently overlapping tables smoothly without isolation errors.
