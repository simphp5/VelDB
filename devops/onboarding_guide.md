# VelDB Onboarding Guide

This guide helps you run the current VelDB sample stack quickly and troubleshoot common issues.

## 0) What You Are Running

Current sample stack includes:

- backend service (Node.js + Express) on port `3000`
- rust-engine service (Rust TCP engine) on port `7000` inside Docker network

The backend returns a JSON response at `/` and a health response at `/health`.

## 1) Prerequisites

- Git (latest)
- Docker Desktop 4.25+ (Docker Engine + Docker Compose v2)
- Optional: Node.js 20+ and Rust 1.78+ for local non-container development

Quick checks:

```bash
docker --version
docker compose version
```

## 2) Clone and Prepare

```bash
git clone <your-repo-url>
cd VelDB
```

Optional environment file for local overrides:

```bash
cp .env.example .env
```

If `.env.example` does not exist yet, create `.env` manually with:

```env
API_PORT=3000
RUST_ENGINE_PORT=7000
RUST_LOG=info
NODE_ENV=production
RUST_ENGINE_URL=tcp://rust-engine:7000
```

On Windows PowerShell, create `.env` quickly with:

```powershell
@"
API_PORT=3000
RUST_ENGINE_PORT=7000
RUST_LOG=info
NODE_ENV=production
RUST_ENGINE_URL=tcp://rust-engine:7000
"@ | Set-Content .env
```

## 3) Build and Run (Docker)

```bash
docker compose -f devops/docker-compose.yml build
docker compose -f devops/docker-compose.yml up -d
```

Expected container names:

- `veldb-backend`
- `veldb-rust-engine`

Check running containers:

```bash
docker compose -f devops/docker-compose.yml ps
```

Expected status: backend should be `healthy`, rust-engine should be `Up`.

## 4) Verify API Endpoints

Basic connectivity check:

```bash
curl http://localhost:3000
```

Expected sample response:

```json
{"service":"veldb-backend","status":"ok","rustEngineUrl":"tcp://rust-engine:7000"}
```

If your backend has a health endpoint:

```bash
curl http://localhost:3000/health
```

Expected:

```json
{"status":"healthy"}
```

Follow logs while testing:

```bash
docker compose -f devops/docker-compose.yml logs -f backend
docker compose -f devops/docker-compose.yml logs -f rust-engine
```

Optional rust-engine quick TCP check (from host if you have netcat):

```bash
nc localhost 7000
```

## 5) Daily Commands

Start services:

```bash
docker compose -f devops/docker-compose.yml up -d
```

Restart services:

```bash
docker compose -f devops/docker-compose.yml restart
```

Stop services (keep data volume):

```bash
docker compose -f devops/docker-compose.yml down
```

Stop and remove all data volumes:

```bash
docker compose -f devops/docker-compose.yml down -v
```

Rebuild only one service:

```bash
docker compose -f devops/docker-compose.yml build backend
docker compose -f devops/docker-compose.yml build rust-engine
```

## 6) Troubleshooting Tips

### 6.1 Build issues

If Node build fails with `npm ci` lockfile errors:

- ensure `api/package-lock.json` exists and is committed

If Rust build fails with `Cargo.toml not found`:

- ensure `core/Cargo.toml` exists
- ensure `core/src/main.rs` exists

### 6.2 Runtime issues

Container not starting:

```bash
docker compose -f devops/docker-compose.yml logs --tail=200 backend
docker compose -f devops/docker-compose.yml logs --tail=200 rust-engine
```

Inspect container details:

```bash
docker inspect veldb-backend
docker inspect veldb-rust-engine
```

Verify network and service DNS:

```bash
docker network inspect veldb_net
```

Check backend response from inside container:

```bash
docker compose -f devops/docker-compose.yml exec -T backend node -e "require('http').get('http://127.0.0.1:3000', r => { console.log(r.statusCode); process.exit(0); }).on('error', () => process.exit(1));"
```

Rebuild cleanly after dependency changes:

```bash
docker compose -f devops/docker-compose.yml down -v --remove-orphans
docker compose -f devops/docker-compose.yml build --no-cache
docker compose -f devops/docker-compose.yml up -d
```

## 7) Best Practices

Folder structure recommendations:

- `core/`: Rust engine source, modules, and Cargo files
- `api/`: Express API source, package manifests, and tests
- `ui/`: React application source
- `.github/workflows/`: CI/CD pipelines
- `devops/`: infrastructure docs, scripts, deployment notes
- Docker files: `devops/docker/`
- Docker Compose file: `devops/docker-compose.yml`

Naming conventions:

- Docker images: `veldb/<service>:<tag>` (example: `veldb/backend:local`)
- Container names: `veldb-<service>`
- Network: `veldb_net`
- Volumes: `veldb_data`
- Environment variables: uppercase snake case (example: `RUST_ENGINE_PORT`)

Debugging workflow:

- Start with `docker compose ps` to confirm state
- Read logs first before restarting
- Validate env variables inside containers:

```bash
docker compose -f devops/docker-compose.yml exec backend env | sort
docker compose -f devops/docker-compose.yml exec rust-engine env | sort
```

- Use incremental checks: container up -> port reachable -> endpoint responds

## 8) First-Day Success Checklist

- `docker compose -f devops/docker-compose.yml build` completes without errors
- `docker compose -f devops/docker-compose.yml up -d` starts both containers
- `docker compose -f devops/docker-compose.yml ps` shows backend healthy
- `curl http://localhost:3000` returns service JSON
- `curl http://localhost:3000/health` returns healthy JSON
