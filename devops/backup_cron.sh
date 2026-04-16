#!/bin/bash
# VelDB Backup Automation Script
# Runs daily to backup VelDB data directory

set -euo pipefail

# Configuration
BACKUP_DIR="/backups/veldb"
DATA_DIR="/data"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/veldb_backup_${TIMESTAMP}.tar.gz"
RETENTION_DAYS=7

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Create backup
echo "Starting VelDB backup at $(date)"
tar -czf "${BACKUP_FILE}" -C "${DATA_DIR}" .

# Verify backup
if [ $? -eq 0 ]; then
    echo "Backup successful: ${BACKUP_FILE}"
    echo "Size: $(du -h "${BACKUP_FILE}" | cut -f1)"
else
    echo "Backup failed!" >&2
    exit 1
fi

# Clean old backups
echo "Removing backups older than ${RETENTION_DAYS} days"
find "${BACKUP_DIR}" -name "veldb_backup_*.tar.gz" -mtime +${RETENTION_DAYS} -delete

echo "Backup completed at $(date)"
exit 0