-- Add migration script here
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    owner_id TEXT NOT NULL -- Hier speichern wir die 'sub' ID aus Keycloak
);

-- Damit wir beim Testen direkt was sehen:
INSERT INTO items (title, description, owner_id)
VALUES ('Erstes SHIBUYA Item', 'Das kommt direkt aus der DB', 'a2e26122-fcc6-481d-b8d7-f99124075121');
