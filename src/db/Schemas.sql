CREATE TABLE IF NOT EXISTS category (
    title VARCHAR(100) PRIMARY KEY NOT NULL,
    description VARCHAR(300) NOT NULL,
    emoji_id VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS choice (
    id SERIAL PRIMARY KEY,
    category INTEGER REFERENCES category(title),
    option_number INT(1) NOT NULL,
    is_mentionable BOOLEAN NOT NULL,
    content VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS vote (
    id SERIAL PRIMARY KEY,
    id_choice INTEGER REFERENCES choice(id),
    person VARCHAR(50) NOT NULL
);

REPLACE INTO category (title, description) VALUES 
    ('Categoria 1', 'Vote na categoria 1'),
    ('Categoria 2', 'Vote na categoria 2');

REPLACE INTO choice (category, option_number, is_mentionable, content) VALUES
    ('Categoria 1', 1, FALSE, 'Opção 1'),
    ('Categoria 1', 2, FALSE, 'Opção 2');