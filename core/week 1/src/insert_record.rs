use crate::product_table::Product;

pub fn insert(products: &mut Vec<Product>, id: i32, name: &str, price: f64) {
    products.push(Product { 
        id, 
        name: name.to_string(), 
        price 
    });
}

