-- Active: 1708089489176@@127.0.0.1@3306@bigmarket

CREATE DATABASE bigmarket;
USE bigmarket;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  telegram_id VARCHAR(255) NOT NULL,
  username VARCHAR(255) DEFAULT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255) DEFAULT NULL,
  lang VARCHAR(2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vacancies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    fullname VARCHAR(255),
    phone VARCHAR(20),
    gender ENUM('male', 'female'),
    birth DATE,
    experience VARCHAR(255),
    resume TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

SELECT * FROM users

