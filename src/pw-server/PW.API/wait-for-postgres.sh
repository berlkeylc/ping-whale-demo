#!/bin/sh
# wait-for-postgres.sh

set -e

host="$1"
shift
cmd="$@"

echo "Waiting for Postgres at $host..."

# Loop until Postgres is ready
until pg_isready -h "$host" -p 5432 >/dev/null 2>&1; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "Postgres is up - executing command"
exec $cmd
