#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER mocha WITH PASSWORD mocha;
    ALTER USER mocha WITH SUPERUSER;
    CREATE DATABASE mocha;
    GRANT ALL PRIVILEGES ON DATABASE mocha TO mocha;
EOSQL
