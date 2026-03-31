const express = require('express');

const app = express();

const port = Number(process.env.PORT || 3000);
const rustEngineUrl = process.env.RUST_ENGINE_URL || 'tcp://rust-engine:7000';

app.get('/', (_req, res) => {
  res.status(200).json({
    service: 'veldb-backend',
    status: 'ok',
    rustEngineUrl,
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`veldb-backend listening on port ${port}`);
});
