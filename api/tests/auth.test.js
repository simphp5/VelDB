// tests/auth.test.js
const request = require("supertest");
const app = require("../app");

describe("Auth API", () => {
  let token;

  test("Login should return token", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "admin", password: "admin123" });

    expect(res.statusCode).toBe(200);
    token = res.body.accessToken;
  });

  test("Protected route without token", async () => {
    const res = await request(app).post("/run_query");
    expect(res.statusCode).toBe(401);
  });

  test("Protected route with token", async () => {
    const res = await request(app)
      .post("/run_query")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});