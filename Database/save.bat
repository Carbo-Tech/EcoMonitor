move schema.sql schema.sql.old
docker exec -it eco_monitor_mysql bash -c "mysqldump -h localhost -P 3306 -u root --routines=true  -p edciv > /appdb/schema.sql"