-- ============================================================
-- QuizApp Full Database Schema (Updated for all upgrades)
-- ============================================================
-- Run this script in MySQL to set up the complete database.
-- Passwords are BCrypt hashed (raw password for both: 1234)
-- ============================================================

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
-- (Added: category, difficulty columns for filtering & analytics)
-- =========================
CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer VARCHAR(10) NOT NULL,
    category VARCHAR(100) DEFAULT NULL,
    difficulty VARCHAR(50) DEFAULT NULL
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
-- JPA default join table name: quizzes_questions
-- =========================
CREATE TABLE quizzes_questions (
    quiz_id BIGINT NOT NULL,
    questions_id BIGINT NOT NULL,
    PRIMARY KEY (quiz_id, questions_id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (questions_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- =========================
-- RESULTS TABLE
-- (quiz_id is nullable — quiz is optional when submitting)
-- =========================
CREATE TABLE results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    quiz_id BIGINT DEFAULT NULL,
    score INT,
    total_questions INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE SET NULL
);


-- =============================================================
--                      SEED DATA
-- =============================================================

-- =========================
-- DEFAULT USERS
-- BCrypt hash of '1234': $2a$10$R9hKbTjYiRua5B7C.wquye7d/R9m4H1.Gj6gO3Qv.fJpXJ7c9pE.a
-- =========================
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@gmail.com', '$2a$10$R9hKbTjYiRua5B7C.wquye7d/R9m4H1.Gj6gO3Qv.fJpXJ7c9pE.a', 'ADMIN');

INSERT INTO users (username, email, password, role)
VALUES ('user1', 'user1@gmail.com', '$2a$10$R9hKbTjYiRua5B7C.wquye7d/R9m4H1.Gj6gO3Qv.fJpXJ7c9pE.a', 'USER');


-- =========================
-- SAMPLE QUESTIONS (with category & difficulty)
-- =========================

-- Math questions
INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty)
VALUES 
('2 + 2 = ?', '2', '3', '4', '5', 'C', 'Math', 'Easy'),
('What is 15 × 3?', '30', '45', '50', '60', 'B', 'Math', 'Easy'),
('What is the square root of 144?', '10', '11', '12', '14', 'C', 'Math', 'Medium'),
('What is 7! (7 factorial)?', '720', '5040', '40320', '2520', 'B', 'Math', 'Hard');

-- General Knowledge questions
INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty)
VALUES 
('Capital of India?', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'B', 'General Knowledge', 'Easy'),
('Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'B', 'General Knowledge', 'Easy'),
('Who painted the Mona Lisa?', 'Van Gogh', 'Picasso', 'Da Vinci', 'Michelangelo', 'C', 'General Knowledge', 'Medium'),
('Which country has the largest population?', 'USA', 'India', 'China', 'Indonesia', 'B', 'General Knowledge', 'Medium');

-- Programming questions
INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty)
VALUES 
('Java is a ?', 'Language', 'Animal', 'Car', 'Game', 'A', 'Programming', 'Easy'),
('What does HTML stand for?', 'Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlinks Text Mark Language', 'Hyper Tool Multi Language', 'A', 'Programming', 'Easy'),
('Which data structure uses LIFO?', 'Queue', 'Stack', 'Array', 'LinkedList', 'B', 'Programming', 'Medium'),
('What is the time complexity of binary search?', 'O(n)', 'O(n²)', 'O(log n)', 'O(1)', 'C', 'Programming', 'Hard');

-- Science questions
INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty)
VALUES 
('What is the chemical symbol for water?', 'H2O', 'CO2', 'O2', 'NaCl', 'A', 'Science', 'Easy'),
('What is the speed of light?', '3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s', 'B', 'Science', 'Medium'),
('What is the powerhouse of the cell?', 'Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body', 'C', 'Science', 'Easy'),
('What element has atomic number 79?', 'Silver', 'Gold', 'Platinum', 'Copper', 'B', 'Science', 'Hard');


-- =========================
-- SAMPLE QUIZ
-- =========================
INSERT INTO quizzes (title)
VALUES ('Basic Quiz');

-- =========================
-- LINK QUESTIONS TO QUIZ
-- =========================
INSERT INTO quizzes_questions (quiz_id, questions_id)
VALUES 
(1, 1),
(1, 2),
(1, 5),
(1, 9),
(1, 13);


-- =========================
-- VERIFY DATA
-- =========================
SELECT id, question, category, difficulty FROM questions;
SELECT * FROM users;
