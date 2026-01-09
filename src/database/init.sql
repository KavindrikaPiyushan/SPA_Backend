CREATE DATABASE IF NOT EXISTS spa_db;
USE spa_db;

CREATE TABLE IF NOT EXISTS User (
  uid INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) UNIQUE NOT NULL 
    CHECK (email != '' AND email REGEXP '^[^@]+@[^@]+\\.[^@]+$'),
  contact VARCHAR(15) 
    CHECK (contact IS NULL OR contact REGEXP '^[0-9]{10,15}$'),
  first_name VARCHAR(50) NOT NULL 
    CHECK (first_name != ''),
  last_name VARCHAR(50) NOT NULL 
    CHECK (last_name != '')
);

CREATE TABLE IF NOT EXISTS Admin (
  aid INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) UNIQUE NOT NULL 
    CHECK (email != '' AND email REGEXP '^[^@]+@[^@]+\\.[^@]+$'),
  contact VARCHAR(15) 
    CHECK (contact IS NULL OR contact REGEXP '^[0-9]{10,15}$'),
  first_name VARCHAR(50) NOT NULL 
    CHECK (first_name != ''),
  last_name VARCHAR(50) NOT NULL 
    CHECK (last_name != ''),
  password_hash VARCHAR(255) NOT NULL 
    CHECK (password_hash != '')
);

CREATE TABLE IF NOT EXISTS Service (
  sid INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL 
    CHECK (name != ''),
  duration INT NOT NULL 
    CHECK (duration > 0),
  description TEXT,
  media JSON,
  status ENUM('active', 'inactive') 
    NOT NULL DEFAULT 'active',
  aid INT,
  FOREIGN KEY (aid) REFERENCES Admin(aid)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Bookings (
  bid INT PRIMARY KEY AUTO_INCREMENT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') 
    NOT NULL DEFAULT 'pending',
  notes TEXT,
  uid INT NOT NULL,
  sid INT NOT NULL,
  FOREIGN KEY (uid) REFERENCES User(uid)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (sid) REFERENCES Service(sid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Logs (
  lid INT PRIMARY KEY AUTO_INCREMENT,
  actor_id INT NOT NULL,
  actor_type ENUM('user', 'admin') NOT NULL,
  action VARCHAR(255) NOT NULL,
  time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_logs_actor_id (actor_id),
  INDEX idx_logs_actor_type (actor_type),
  INDEX idx_logs_time (time)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  actor_id INT NOT NULL,
  actor_type ENUM('user', 'admin') NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_refresh_tokens_actor (actor_id, actor_type)
);
