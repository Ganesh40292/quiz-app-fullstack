-- Create Database
CREATE DATABASE IF NOT EXISTS quizdb;
USE quizdb;

-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER'
);

-- =========================
-- QUESTIONS TABLE
-- =========================
CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    option_a VARCHAR(255),
    option_b VARCHAR(255),
    option_c VARCHAR(255),
    option_d VARCHAR(255),
    correct_answer VARCHAR(10)
);

-- =========================
-- QUIZZES TABLE
-- =========================
CREATE TABLE quizzes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255)
);

-- =========================
-- QUIZ-QUESTION MAPPING (Many-to-Many)
-- =========================
CREATE TABLE quiz_questions (
    quiz_id BIGINT,
    question_id BIGINT,
    PRIMARY KEY (quiz_id, question_id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- =========================
-- RESULTS TABLE
-- =========================
CREATE TABLE results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    quiz_id BIGINT,
    score INT,
    total_questions INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- ADMIN USER
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@gmail.com', '1234', 'ADMIN');

-- NORMAL USER
INSERT INTO users (username, email, password, role)
VALUES ('user1', 'user1@gmail.com', '1234', 'USER');


-- QUESTIONS
INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer)
VALUES 
('2 + 2 = ?', '2', '3', '4', '5', 'C'),
('Capital of India?', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'B'),
('Java is a ?', 'Language', 'Animal', 'Car', 'Game', 'A');


-- QUIZ
INSERT INTO quizzes (title)
VALUES ('Basic Quiz');


-- LINK QUESTIONS TO QUIZ
INSERT INTO quiz_questions (quiz_id, question_id)
VALUES 
(1,1),
(1,2),
(1,3);

SELECT * FROM questions;

