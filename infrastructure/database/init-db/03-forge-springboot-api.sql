-- Bestehende Befehle
CREATE DATABASE springboot_db;
CREATE USER springboot_user WITH PASSWORD 'springboot_password';
GRANT ALL PRIVILEGES ON DATABASE springboot_db TO springboot_user;

-- NEU: Berechtigungen für das Schema vergeben
-- Wir müssen uns mit der Datenbank verbinden, um die Rechte im Schema zu setzen
\c springboot_db

GRANT ALL ON SCHEMA public TO springboot_user;
-- Falls du ganz sicher gehen willst (für Postgres 15+):
ALTER SCHEMA public OWNER TO springboot_user;
