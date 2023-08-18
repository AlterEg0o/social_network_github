CREATE TABLE IF NOT EXISTS notifications(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "type" VARCHAR(255),
    "description" VARCHAR(255),
    is_checked BOOLEAN,
    user VARCHAR(255),
    FOREIGN KEY (user) REFERENCES user(nickname)
)