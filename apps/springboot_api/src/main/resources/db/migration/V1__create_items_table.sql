CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id VARCHAR(255) NOT NULL
);

INSERT INTO items (title, description, owner_id)
VALUES ('Erstes SHIBUYA Item', 'Das kommt direkt aus der DB via Spring Boot', 'a2e26122-fcc6-481d-b8d7-f99124075121');
