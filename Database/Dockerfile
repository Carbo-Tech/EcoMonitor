FROM mysql/mysql-server

ENV MYSQL_ROOT_HOST=%

ADD schema.sql /docker-entrypoint-initdb.d

CMD ["mysqld", "--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci"]