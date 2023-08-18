CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255),
    content VARCHAR(255),
    privacy INT,
    author VARCHAR(255),
    imageURL VARCHAR(255),
    FOREIGN KEY (author) REFERENCES user(nickname)
);

