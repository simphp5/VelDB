use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Product {
    pub id: i32,
    pub name: String,
    pub price: f64,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct Table {
    pub products: Vec<Product>,
}

