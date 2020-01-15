#!/usr/bin/env bash

TIMESTAMP=$(date +"%s")

FILENAME="hapiline_backup_$TIMESTAMP"

echo "$FILENAME"

docker-compose exec db pg_dump --data-only -U docker -w -d hapiline -f "$FILENAME"
docker-compose exec db mv "$FILENAME" "data/db"
