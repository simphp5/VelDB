use std::env;
use std::fs;
use std::io::Write;
use std::net::TcpListener;

fn parse_flag(args: &[String], flag: &str, default: &str) -> String {
    args.windows(2)
        .find(|w| w[0] == flag)
        .map(|w| w[1].clone())
        .unwrap_or_else(|| default.to_string())
}

fn main() -> std::io::Result<()> {
    let args: Vec<String> = env::args().collect();

    let host = parse_flag(&args, "--host", "0.0.0.0");
    let port = parse_flag(&args, "--port", "7000");
    let data_dir = parse_flag(&args, "--data-dir", "/data");

    fs::create_dir_all(&data_dir)?;
    let mut marker = fs::File::create(format!("{}/engine_started.txt", data_dir))?;
    marker.write_all(b"VelDB sample engine started\n")?;

    let bind_addr = format!("{}:{}", host, port);
    let listener = TcpListener::bind(&bind_addr)?;
    println!("veldb-engine listening on {}", bind_addr);

    for incoming in listener.incoming() {
        match incoming {
            Ok(mut stream) => {
                let _ = stream.write_all(b"veldb-engine:ok\n");
            }
            Err(err) => {
                eprintln!("connection error: {}", err);
            }
        }
    }

    Ok(())
}
