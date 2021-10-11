# How to setup

1. Update database connections in `database.json`

2. Log into mysql client with `mysql -u root`

3. Create a new database user with the following commands
```
CREATE USER 'foo'@'%' IDENTIFIED WITH mysql_native_password BY 'bar';
grant all privileges on *.* to 'foo'@'%';

FLUSH PRIVILEGES;
```

4. Create a new database named `organic`

5. Exit mysql client (or open a new terminal)

6. Install nodemon with `npm install -g nodemon`

6. Add permission to run ./db-migrate.sh with `chmod +x ./db-migrate.sh

7. Install all node modules with `yarn install`

8. Run all migrations with `./db-migrate.sh up`

