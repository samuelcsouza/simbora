CREATE SCHEMA bet;

CREATE TABLE IF NOT EXISTS bet.events (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    player1 VARCHAR(255) NOT NULL,
    player2 VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    event_id VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS bet.events_updates (
    update_id SERIAL PRIMARY KEY NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    message TEXT,
    event_id INT,
    FOREIGN KEY (event_id) REFERENCES events(id)
);
