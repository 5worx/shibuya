CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL -- Die User-ID aus Keycloak (Sub-Claim)
);

INSERT INTO items (title, description, owner_id) VALUES
('Geheimes Projekt', 'Nur für authentifizierte User', 'a2e26122-fcc6-481d-b8d7-f99124075121');
