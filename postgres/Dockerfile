FROM postgres:15

ADD 000-mocha-database.sh /docker-entrypoint-initdb.d/

ENV POSTGRES_USER=${POSTGRES_USER:-postgres}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}
ENV POSTGRES_DB=${POSTGRES_DB:-gapp}