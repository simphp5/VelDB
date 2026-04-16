# VelDB Runbook

## Overview
This runbook provides operational procedures for deploying, monitoring, and troubleshooting VelDB.

## Deployment

### Local Development
```bash
docker compose -f devops/docker-compose.yml build
docker compose -f devops/docker-compose.yml up -d
```

### Staging Deployment
See [deploy.yml](./deploy.yml) for GitHub Actions workflow.

### Production Deployment
1. Ensure Docker Engine is installed
2. Copy production docker-compose.prod.yml (if exists)
3. Set environment variables in .env.prod
4. Run: `docker compose -f docker-compose.prod.yml up -d`

## Monitoring

### Prometheus
Prometheus is configured via [prometheus.yml](./prometheus.yml). It scrapes:
- Backend API metrics (if exposed)
- Rust engine metrics (if exposed)

Access Prometheus UI at http://localhost:9090

### Grafana
Grafana dashboards are provisioned via [grafana_dashboard.json](./grafana_dashboard.json).
Access Grafana at http://localhost:3000 (admin/admin)

## Backup & Restore

### Automated Backup
The [backup_cron.sh](./backup_cron.sh) script performs daily backups of the database data directory.
Backups are stored in `/backups/veldb/` with timestamped filenames.

### Manual Backup
```bash
./devops/backup_cron.sh
```

### Restore
1. Stop VelDB services
2. Copy backup data to the data directory
3. Start services

## Troubleshooting

### Service Not Responding
1. Check container status: `docker compose ps`
2. View logs: `docker compose logs <service>`
3. Check ports: `netstat -tulpn | grep LISTEN`
4. Restart service: `docker compose restart <service>`

### High CPU/Memory
1. Identify problematic container: `docker stats`
2. Check logs for errors
3. Consider scaling resources

### Database Connection Issues
1. Verify PostgreSQL connection: `docker compose exec postgres psql -U postgres`
2. Check environment variables in docker-compose.yml
3. Ensure network connectivity between services

## Security
- Rotate secrets regularly
- Update base images monthly
- Scan images for vulnerabilities: `docker scan <image>`