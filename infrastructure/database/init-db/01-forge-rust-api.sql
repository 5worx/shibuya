-- Bestehende Befehle
CREATE DATABASE rust_db;
CREATE USER rust_user WITH PASSWORD 'rust_password';
GRANT ALL PRIVILEGES ON DATABASE rust_db TO rust_user;

-- NEU: Berechtigungen für das Schema vergeben
-- Wir müssen uns mit der Datenbank verbinden, um die Rechte im Schema zu setzen
\c rust_db

GRANT ALL ON SCHEMA public TO rust_user;
-- Falls du ganz sicher gehen willst (für Postgres 15+):
ALTER SCHEMA public OWNER TO rust_user;
