CREATE TABLE IF NOT EXISTS group_event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    groupId INT,
    title VARCHAR(255),
    event_desc VARCHAR(255),
    created_at VARCHAR(255),
    interested INT,
    not_interested INT,
    FOREIGN KEY (groupId) REFERENCES groups_users(id),
);