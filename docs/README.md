# Quiz App (React + Spring Boot)

A full-stack quiz application where users can take quizzes and admins can manage questions.

## Features
- User login (admin/user)
- Quiz with timer
- Result display
- Admin panel (Add/Edit/Delete questions)

## Tech Stack
- Frontend: React
- Backend: Spring Boot
- Database: MySQL

## Database Setup

1. Create database:
   CREATE DATABASE quizdb;

2. Run schema.sql from database folder

## How to Run

### Backend
cd backend
mvn spring-boot:run

### Frontend
cd frontend
npm install
npm start

## API Endpoints

### Quiz APIs
GET /api/quiz/questions  
POST /api/quiz/submit  

### Admin APIs
POST /api/admin/add  
PUT /api/admin/update/{id}  
DELETE /api/admin/delete/{id}

## Authentication

- Role-based login (admin/user)
- Admin APIs protected using role header