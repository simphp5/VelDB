const request = require('supertest');
const app = require('../app');

describe('Week 4 API Tests', () => {

  test('GET /api/data', async () => {
    const res = await request(app).get('/api/data');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Sample API working");
  });

  test('POST /api/data/long-query', async () => {
    const res = await request(app)
      .post('/api/data/long-query')
      .send({ query: "SELECT * FROM users" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Job added");
  });

  test('POST /api/export CSV', async () => {
    const res = await request(app)
      .post('/api/export')
      .send({
        data: [{ name: "John" }],
        format: "csv"
      });

    expect(res.statusCode).toBe(200);
  });

  test('POST /api/export PDF', async () => {
    const res = await request(app)
      .post('/api/export')
      .send({
        data: [{ name: "John" }],
        format: "pdf"
      });

    expect(res.statusCode).toBe(200);
  });

});