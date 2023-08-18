CREATE TABLE IF NOT EXISTS followers(
    follower VARCHAR(255),
    following VARCHAR(255),
    FOREIGN KEY (follower) REFERENCES users(nickname),
    FOREIGN KEY (following) REFERENCES users(nickname),
    PRIMARY KEY (follower,following)
)