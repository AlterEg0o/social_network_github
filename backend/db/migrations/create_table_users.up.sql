CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  date_of_birth INT,
  email VARCHAR(255),
  password VARCHAR(255),
  username VARCHAR(255),
  is_private BOOLEAN,
  about_me VARCHAR(255),
  avatar VARCHAR(255)
);

