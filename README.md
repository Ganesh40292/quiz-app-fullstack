# 🎯 Quiz App (React + Spring Boot + MySQL)

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Spring Boot](https://img.shields.io/badge/Backend-SpringBoot-green?logo=springboot)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange?logo=mysql)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Project-Completed-success)

---

## 📌 Project Overview

This is a **full-stack interactive quiz application** developed using **React (Frontend)** and **Spring Boot (Backend)** with **MySQL database integration**.

The application allows:

* Users to take quizzes with a timer ⏱️
* View scores and correct answers 📊
* Admin to manage questions dynamically 🛠️

---

## ✨ Features

### 👤 User Features

* 🔐 Login (User/Admin)
* 📝 Attempt quiz
* ⏱️ Timer-based quiz (1 min per question)
* 📊 View score & percentage
* 🔍 Review answers

### 👑 Admin Features

* ➕ Add questions
* ✏️ Edit questions
* ❌ Delete questions
* 📋 View all questions

---

## 🛠️ Tech Stack

| Layer           | Technology     |
| --------------- | -------------- |
| Frontend        | React.js       |
| Backend         | Spring Boot    |
| Database        | MySQL          |
| Styling         | CSS (Glass UI) |
| Version Control | Git + GitHub   |

---

## 📂 Project Structure

```
quiz-app-project/
│
├── backend/        # Spring Boot Backend
├── frontend/       # React Frontend
├── database/       # SQL Scripts
├── docs/           # Documentation
└── .gitignore
```

---

## 🗄️ Database Setup

```sql
CREATE DATABASE quizdb;
```

👉 Then run:

* `database/schema.sql`
* `database/data.sql`

---

## ⚙️ Backend Setup

```bash
cd backend
mvn spring-boot:run
```

Runs on:

```
http://localhost:8080
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Runs on:

```
http://localhost:3000
```

---

## 🔗 API Endpoints

### 🟢 Quiz APIs

```
GET    /api/quiz/questions
POST   /api/quiz/submit
```

### 🔴 Admin APIs

```
POST   /api/admin/add
PUT    /api/admin/update/{id}
DELETE /api/admin/delete/{id}
GET    /api/admin/questions
```

---

## 🔐 Authentication

* Role-based login system (Admin/User)
* Admin routes protected via request header (`role`)
* Simple session-based authentication

---

## 🔑 Default Credentials

| Role  | Username | Password  |
| ----- | -------- | --------- |
| Admin | admin    | Admin@123 |
| User  | user     | User@123  |

---

## 📸 Screenshots

* Login Page
* Quiz Page
* Result Page
* Admin Dashboard

*(Add screenshots here for extra marks ⭐)*

---

## 🚀 Future Improvements

* 🔐 JWT Authentication
* 📊 Leaderboard system
* 👥 User registration (DB-based)
* 📈 Analytics dashboard

---

## 📚 Learning Outcomes

* Full-stack development (React + Spring Boot)
* REST API integration
* State management in React
* Database connectivity (JPA + MySQL)
* Role-based access control

---

## 🧠 Author

**Ganesh Prasad**
CSE Engineering Student

---

## 📄 License

This project is developed for **academic purposes**.

---

## ⭐ Final Note

This project demonstrates a **complete full-stack workflow**, including frontend UI, backend APIs, and database integration — making it a strong academic submission.

---
