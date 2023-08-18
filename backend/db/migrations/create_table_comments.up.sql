CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content VARCHAR(255),
    author VARCHAR(255),
    post_id INT,
    
    FOREIGN KEY (author) REFERENCES user(nickname),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

