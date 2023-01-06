
CREATE TABLE users (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(250) NOT NULL UNIQUE,
    password VARCHAR(250) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO users( username, email, password)
VALUES ('bob', 'bob@bob.bob', 'bingbong'); 


CREATE TABLE items (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL,
    weight NUMERIC(5,2) NOT NULL, 
    quantity SMALLINT NOT NULL,
    notes VARCHAR(200),
    date DATA,
);