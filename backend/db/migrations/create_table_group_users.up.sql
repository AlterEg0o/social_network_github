CREATE TABLE IF NOT EXISTS groups_users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user VARCHAR(255),
    title TEXT,
    is_accepted BOOLEAN,
    FOREIGN KEY (user) REFERENCES users(nickname),
    FOREIGN KEY (title) REFERENCES groups(title)
)