API Endpoints
1. Health Check

GET /

http://localhost:3000/

Response:

VelDB API Running
2. Run SQL Query

POST /run_query

http://localhost:3000/run_query

Request Body:

{
  "query": "SELECT * FROM employees"
}
3. Get Tables

GET /tables

http://localhost:3000/tables
4. Get Table Schema

GET /schema/
Example:

http://localhost:3000/schema/employees
How to Run the Project
Step 1 – Build Rust Engine
cd core
cargo build --release
Step 2 – Start API Server
cd api
npm install
node api.js

Server runs at:

http://localhost:3000

Week 2 Tasks Completed
Created API service layer
Connected Node.js API with Rust engine
Implemented /run_query endpoint
Implemented /tables endpoint
Implemented /schema endpoint
Tested endpoints using Postman
Added API documentation
Pushed backend branch to GitHub
Contributors
Divya – Backend API Development
Sunil – Rust Database Engine