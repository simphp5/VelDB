struct User {
    id: i32,
    name: String,
}

fn delete(users: &mut Vec<User>, id: i32) {
    users.retain(|u| u.id != id);
}

fn main() {

    let mut users = vec![
        User { id: 1, name: String::from("Alice") },
        User { id: 2, name: String::from("Bob") },
        User { id: 3, name: String::from("Charlie") },
    ];

    delete(&mut users, 2);

    for u in users {
        println!("{} {}", u.id, u.name);
    }
}