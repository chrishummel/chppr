# YumSnap!
Version 2.0

## Database Setup

If you don't have Postgres on your computer run
```
brew install postgres
```
Run npm install
and then run:
```
npm install -g knex
```
Then start your database and run:
```
//postgres -D /usr/local/var/postgres

initdb db
pg_ctl -D db -l logfile start
createdb yumsnap
knex migrate:latest
knex seed:run
```
Do not CTRL-C to stop Postgres
To stop your database:
```
pg_ctl -D /usr/local/var/postgres stop -s -m fast

To start the client server npm run dev (for local host:8080)

to drop the database

dropdb yumsnap
