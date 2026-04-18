use std::fs::{self, OpenOptions};
use std::io::{self, BufRead, Write};
use std::path::Path;

#[derive(Clone, Debug, PartialEq)]
pub struct Row {
    pub id: u32,
    pub name: String,
    pub salary: u32,
}

impl Row {
    pub fn to_csv(&self) -> String {
        format!("{},{},{}", self.id, self.name, self.salary)
    }

    pub fn from_csv(line: &str) -> Option<Row> {
        let parts: Vec<&str> = line.split(',').collect();
        if parts.len() == 3 {
            let id = parts[0].parse().ok()?;
            let name = parts[1].to_string();
            let salary = parts[2].parse().ok()?;
            Some(Row { id, name, salary })
        } else {
            None
        }
    }
}

pub struct FileStorage {
    file_path: String,
}

impl FileStorage {
    pub fn new(file_path: &str) -> Self {
        // Create file if it doesn't exist
        if !Path::new(file_path).exists() {
            fs::File::create(file_path).unwrap();
        }
        FileStorage {
            file_path: file_path.to_string(),
        }
    }

    pub fn read_all(&self) -> io::Result<Vec<Row>> {
        let file = fs::File::open(&self.file_path)?;
        let reader = io::BufReader::new(file);
        let mut rows = Vec::new();
        for line in reader.lines() {
            let line = line?;
            if let Some(row) = Row::from_csv(&line) {
                rows.push(row);
            }
        }
        Ok(rows)
    }

    pub fn write_all(&self, rows: &[Row]) -> io::Result<()> {
        let mut file = OpenOptions::new()
            .write(true)
            .truncate(true)
            .create(true)
            .open(&self.file_path)?;
        for row in rows {
            writeln!(file, "{}", row.to_csv())?;
        }
        Ok(())
    }
}
