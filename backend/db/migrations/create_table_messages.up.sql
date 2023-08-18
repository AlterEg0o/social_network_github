CREATE TABLE IF NOT EXISTS messages(
    content VARCHAR(255),
    created_at VARCHAR(255),
    sender VARCHAR(255),
    receiver VARCHAR(255),
    FOREIGN KEY (sender) REFERENCES users(nickname),
    FOREIGN KEY (receiver) REFERENCES users(nickname)
)