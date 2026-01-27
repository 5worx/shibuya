-- Bestehende Befehle
CREATE DATABASE rust_api_db;
CREATE USER rust_api_user WITH PASSWORD 'shibuya_api_password';
GRANT ALL PRIVILEGES ON DATABASE rust_api_db TO rust_api_user;

-- NEU: Berechtigungen für das Schema vergeben
-- Wir müssen uns mit der Datenbank verbinden, um die Rechte im Schema zu setzen
\c rust_api_db

GRANT ALL ON SCHEMA public TO rust_api_user;
-- Falls du ganz sicher gehen willst (für Postgres 15+):
ALTER SCHEMA public OWNER TO rust_api_user;
