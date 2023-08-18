CREATE TABLE IF NOT EXISTS private_posts{
    post_id INTEGER,
    user VARCHAR(255),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user) REFERENCES users(nickname),
    PRIMARY KEY (post_id,user)
};