CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INT,
    title VARCHAR(255),
    content VARCHAR(255),
    privacy INT,
    author VARCHAR(255),
    imageURL VARCHAR(255),
    FOREIGN KEY (author) REFERENCES user(nickname)
    FOREIGN KEY (group_id) REFERENCES groups_users(id)
);

