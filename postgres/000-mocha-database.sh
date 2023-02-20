#!/bin/bash

set -e

# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -f /docker-entrypoint-initdb.d/init_mocha.sql
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  SELECT 'CREATE USER mocha WITH PASSWORD ''mocha'' SUPERUSER;'
  WHERE NOT EXISTS (SELECT usename FROM "pg_catalog"."pg_user")\gexec


  SELECT 'CREATE DATABASE mocha;'
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mocha')\gexec

  GRANT ALL PRIVILEGES ON DATABASE mocha TO mocha;
EOSQL
