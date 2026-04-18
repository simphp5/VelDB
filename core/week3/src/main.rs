mod executor;
mod join_engine;
mod optimizer;
mod transaction;

use executor::Executor;
use std::fs::File;
use std::io::Write;

fn create_mock_data() {
    let mock_files = vec![
        (
            "customers.vdb",
            "1, John Doe, New York, customer_id = 1;\n2, Jane Smith, London, customer_id = 2;\n3, Bob, Paris, customer_id = 3;\n4, Alice, customer_id = 4;\ntest@example.com",
        ),
        (
            "products.vdb",
            "1, Laptop, price = 1000;\n10, Mouse, product_id = 10; price = 50;\nstock = '0';\nprice = 99",
        ),
        (
            "orders.vdb",
            "1, 1, status = 'Processing';\n99, order_id = 99;\n100, 2, status = 'Processing';\ntotal = 500\ntotal = 1000\ntotal = 200",
        ),
        (
            "employees.vdb",
            "5, Bob, employee_id = 5;\ndepartment = 'Sales';\ndept_id = 1, date_joined = 2021",
        ),
        (
            "inventory.vdb",
            "1, 50, product_id = 1;\n10, 100, product_id = 10;",
        ),
        (
            "departments.vdb",
            "1, Engineering;\n2, Marketing;",
        ),
        (
            "users.vdb",
            "1, test1@example.com;\n2, test2@example.com;",
        ),
        (
            "profiles.vdb",
            "1, bio1;\n2, bio2;",
        ),
        (
            "top_scores.vdb",
            "100, score = 100;\n200, score = 200;\n300, score = 300;",
        ),
    ];

    for (filename, content) in mock_files {
        let mut file = File::create(filename).unwrap();
        file.write_all(content.as_bytes()).unwrap();
    }
}

fn main() {
    println!("--- VelDB Query Engine (Week 3) ---");
    
    println!("\n[1] Creating mock data files (.vdb)...");
    create_mock_data();
    println!("Mock data initialized successfully.\n");

    let queries = vec![
        "UPDATE customers SET city = 'Chennai' WHERE customer_id = 1;",
        "UPDATE products SET price = '150' WHERE product_id = 10;",
        "UPDATE orders SET status = 'Shipped' WHERE status = 'Processing';",
        "UPDATE employees SET role = 'Manager' WHERE employee_id = 5;",
        "DELETE FROM customers WHERE customer_id = 3;",
        "DELETE FROM products WHERE stock = '0';",
        "DELETE FROM orders WHERE order_id = 99;",
        "DELETE FROM employees WHERE department = 'Sales';",
        "SELECT customers.name, orders.total FROM customers INNER JOIN orders ON customers.customer_id = orders.customer_id;",
        "SELECT products.name, inventory.stock FROM products INNER JOIN inventory ON products.id = inventory.product_id;",
        "SELECT employees.name, departments.name FROM employees INNER JOIN departments ON employees.dept_id = departments.id;",
        "SELECT users.email, profiles.bio FROM users INNER JOIN profiles ON users.id = profiles.user_id;",
        "SELECT * FROM products ORDER BY price DESC;",
        "SELECT * FROM employees ORDER BY date_joined ASC;",
        "SELECT * FROM orders ORDER BY total DESC;",
        "SELECT * FROM products LIMIT 5;",
        "SELECT * FROM customers LIMIT 10;",
        "SELECT * FROM orders ORDER BY total DESC LIMIT 3;",
        "SELECT * FROM top_scores ORDER BY score DESC LIMIT 1;",
        "SELECT * FROM customers WHERE email = 'test@example.com';",
    ];

    let mut executor = Executor::new();

    println!("[2] Running Test Queries...\n");
    for (i, query) in queries.iter().enumerate() {
        println!("--------------------------------------------------");
        println!("Test {}: {}", i + 1, query);
        let result = executor.execute_query(query);
        println!("Result:\n{}", result);
    }
    
    println!("--------------------------------------------------");
    println!("All test queries executed.");
}
