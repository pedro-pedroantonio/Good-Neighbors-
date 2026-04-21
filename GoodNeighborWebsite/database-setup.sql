-- Database Setup for Good Neighbors of Blount County
-- Run these commands in your MySQL database

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS goodneighbors_of_blount_county_db;
USE goodneighbors_of_blount_county_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  authorId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (name, email) VALUES
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com'),
('Bob Johnson', 'bob@example.com');

INSERT INTO posts (title, content, authorId) VALUES
('Welcome to Good Neighbors!', 'Welcome to our community platform. Here you can connect with neighbors and share important updates.', 1),
('Community Meeting This Saturday', 'We will be having our monthly community meeting at the town hall this Saturday at 10 AM. All neighbors are welcome!', 2),
('Neighborhood Watch Program', 'We are starting a neighborhood watch program to keep our community safe. If you are interested in participating, please contact Jane Smith.', 2);

-- Verify tables were created
SHOW TABLES;
DESCRIBE users;
DESCRIBE posts;