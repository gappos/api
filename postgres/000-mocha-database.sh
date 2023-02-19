#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -f /docker-entrypoint-initdb.d/init_mocha.sql
# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
#     DO $$ 
#     BEGIN 
#         CREATE USER mocha WITH PASSWORD 'mocha' SUPERUSER;
#         EXCEPTION WHEN duplicate_object THEN RAISE NOTICE '% skipping', SQLERRM USING ERRCODE = SQLSTATE;
#     END;
#     $$;

#     CREATE DATABASE IF NOT EXISTS mocha;
#     GRANT ALL PRIVILEGES ON DATABASE mocha TO mocha;
# EOSQL

