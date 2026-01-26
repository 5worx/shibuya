-- Erstellen der Datenbanken für die verschiedenen Services
CREATE DATABASE rust_api_db;
CREATE DATABASE typo3_db;

-- Erstellen der User (optional, aber sauber für SHIBUYA)
-- So hat jede API nur Zugriff auf ihren eigenen Bereich
CREATE USER rust_api_user WITH PASSWORD 'shibuya_api_password';
GRANT ALL PRIVILEGES ON DATABASE rust_api_db TO rust_api_user;
