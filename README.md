# VelDB - Intelligent Database Platform

## Sample Requirements To Run

1. Docker Desktop 4.25+ with Docker Compose v2
1. Ports `3000` and `7000` available on your machine

## Required Sample Files (Added)

1. `api/package.json`
1. `api/package-lock.json`
1. `api/server.js`
1. `core/Cargo.toml`
1. `core/src/main.rs`

## Run

```bash
docker compose -f devops/docker-compose.yml build
docker compose -f devops/docker-compose.yml up -d
```

## Verify

```bash
docker compose -f devops/docker-compose.yml ps
curl http://localhost:3000/
```

Expected API response:

```json
{"service":"veldb-backend","status":"ok","rustEngineUrl":"tcp://rust-engine:7000"}
```
