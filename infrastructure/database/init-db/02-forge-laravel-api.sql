-- Bestehende Befehle
CREATE DATABASE laravel_db;
CREATE USER laravel_user WITH PASSWORD 'laravel_password';
GRANT ALL PRIVILEGES ON DATABASE laravel_db TO laravel_user;

-- NEU: Berechtigungen für das Schema vergeben
-- Wir müssen uns mit der Datenbank verbinden, um die Rechte im Schema zu setzen
\c laravel_db

GRANT ALL ON SCHEMA public TO laravel_user;
-- Falls du ganz sicher gehen willst (für Postgres 15+):
ALTER SCHEMA public OWNER TO laravel_user;
