use crate::core::storage::file_storage::{FileStorage, Row};

pub struct TransactionManager {
    storage: FileStorage,
    is_active: bool,
    staged_data: Option<Vec<Row>>,
}

impl TransactionManager {
    pub fn new(file_path: &str) -> Self {
        TransactionManager {
            storage: FileStorage::new(file_path),
            is_active: false,
            staged_data: None,
        }
    }

    pub fn is_active(&self) -> bool {
        self.is_active
    }

    pub fn begin(&mut self) -> Result<(), &'static str> {
        if self.is_active {
            return Err("Transaction already active");
        }
        println!("> BEGIN Transaction");
        // Load current data into staged memory
        let current_data = self.storage.read_all().unwrap_or_default();
        self.staged_data = Some(current_data);
        self.is_active = true;
        Ok(())
    }

    pub fn commit(&mut self) -> Result<(), &'static str> {
        if !self.is_active {
            return Err("Cannot commit without an active transaction");
        }
        println!("> COMMIT Transaction");
        if let Some(data) = &self.staged_data {
            if let Err(e) = self.storage.write_all(data) {
                println!("Error writing data: {}", e);
                return Err("Failed to persist data");
            }
        }
        
        self.staged_data = None;
        self.is_active = false;
        Ok(())
    }

    pub fn rollback(&mut self) -> Result<(), &'static str> {
        if !self.is_active {
            return Err("Cannot rollback without an active transaction");
        }
        println!("> ROLLBACK Transaction");
        // Discard staged data
        self.staged_data = None;
        self.is_active = false;
        Ok(())
    }

    pub fn insert_row(&mut self, row: Row) -> Result<(), &'static str> {
        if self.is_active {
            if let Some(data) = &mut self.staged_data {
                if data.iter().any(|r| r.id == row.id) {
                    return Err("Row with this ID already exists");
                }
                println!("(Staged) Inserted row {}", row.id);
                data.push(row);
            }
        } else {
            // No active transaction -> direct write (Auto-commit)
            let mut current_data = self.storage.read_all().unwrap_or_default();
            if current_data.iter().any(|r| r.id == row.id) {
                return Err("Row with this ID already exists");
            }
            println!("(Disk) Inserted row {}", row.id);
            current_data.push(row);
            let _ = self.storage.write_all(&current_data);
        }
        Ok(())
    }

    pub fn update_row(&mut self, id: u32, name: &str, salary: u32) -> Result<(), &'static str> {
        let mut found = false;
        if self.is_active {
            if let Some(data) = &mut self.staged_data {
                for row in data.iter_mut() {
                    if row.id == id {
                        row.name = name.to_string();
                        row.salary = salary;
                        found = true;
                        break;
                    }
                }
            }
            if found {
                println!("(Staged) Updated row {}", id);
            }
        } else {
            let mut current_data = self.storage.read_all().unwrap_or_default();
            for row in current_data.iter_mut() {
                if row.id == id {
                    row.name = name.to_string();
                    row.salary = salary;
                    found = true;
                    break;
                }
            }
            if found {
                let _ = self.storage.write_all(&current_data);
                println!("(Disk) Updated row {}", id);
            }
        }
        if !found {
            return Err("Row not found for update");
        }
        Ok(())
    }

    pub fn delete_row(&mut self, id: u32) -> Result<(), &'static str> {
        let mut found = false;
        if self.is_active {
            if let Some(data) = &mut self.staged_data {
                let initial_len = data.len();
                data.retain(|r| r.id != id);
                found = data.len() < initial_len;
            }
            if found {
                println!("(Staged) Deleted row {}", id);
            }
        } else {
            let mut current_data = self.storage.read_all().unwrap_or_default();
            let initial_len = current_data.len();
            current_data.retain(|r| r.id != id);
            found = current_data.len() < initial_len;
            if found {
                let _ = self.storage.write_all(&current_data);
                println!("(Disk) Deleted row {}", id);
            }
        }
        if !found {
            return Err("Row not found for delete");
        }
        Ok(())
    }

    pub fn select_rows(&self) -> Vec<Row> {
        if self.is_active {
            self.staged_data.clone().unwrap_or_default()
        } else {
            self.storage.read_all().unwrap_or_default()
        }
    }
}
