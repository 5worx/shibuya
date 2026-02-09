CREATE TABLE IF NOT EXISTS people (
    id SERIAL PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);
