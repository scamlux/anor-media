#!/usr/bin/env sh
set -eu

BACKUP_DIR=${BACKUP_DIR:-/backups}
RETENTION_DAYS=${RETENTION_DAYS:-30}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="${BACKUP_DIR}/anor_media_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"
pg_dump "${DATABASE_URL}" | gzip > "${FILENAME}"

find "${BACKUP_DIR}" -name 'anor_media_*.sql.gz' -type f -mtime +"${RETENTION_DAYS}" -delete

echo "backup written: ${FILENAME}"
