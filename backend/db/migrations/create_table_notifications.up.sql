CREATE TABLE IF NOT EXISTS notifications(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notif_type VARCHAR(255),
    notif_desc VARCHAR(255),
    is_checked BOOLEAN,
    user VARCHAR(255),
    FOREIGN KEY (user) REFERENCES user(nickname)
)