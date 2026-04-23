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

## 🚀 Getting Started (Complete Setup)

Follow these steps to run the project locally.

---

### 🔽 1. Clone the Repository

```bash
git clone https://github.com/Ganesh40292/quiz-app-react-springboot.git
cd quiz-app-react-springboot
```

---

### 🗄️ 2. Setup Database (MySQL)

```sql
CREATE DATABASE quizdb;
```

👉 Then run:

* `database/schema.sql`
* `database/data.sql`

---

### ⚙️ 3. Run Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

📍 Backend runs at:

```
http://localhost:8080
```

---

### 💻 4. Run Frontend (React)

Open new terminal:

```bash
cd frontend
npm install
npm start
```

📍 Frontend runs at:

```
http://localhost:3000
```

---

### 🔐 5. Login Credentials

| Role  | Username | Password  |
| ----- | -------- | --------- |
| Admin | admin    | Admin@123 |
| User  | user     | User@123  |

---

### ✅ 6. Done!

* Open browser → `http://localhost:3000`
* Login → Take quiz / Admin panel

---


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


## 📸 Screenshots

* Login Page
  <img width="1913" height="1012" alt="Screenshot 2026-04-23 203419" src="https://github.com/user-attachments/assets/93776cc9-c92d-4e74-ba24-4f5c8cdf8a94" />

* Quiz Page
  <img width="1883" height="1026" alt="Screenshot 2026-04-23 203430" src="https://github.com/user-attachments/assets/dc7a663a-ddf6-4527-9196-1539fa3204ee" />

* Result Page
  <img width="1911" height="1007" alt="Screenshot 2026-04-23 204059" src="https://github.com/user-attachments/assets/98ae1775-fe5c-4b69-b90c-1770352d93fa" />

* Admin Dashboard
  <img width="1897" height="1000" alt="Screenshot 2026-04-23 203446" src="https://github.com/user-attachments/assets/e7d50ff8-bbb2-48b8-b650-358bac9edc12" />


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

**Ganesh Prasad** - 
CSE Engineering Student

---

## 📄 License

This project is developed for **academic purposes**.

---

## ⭐ Final Note

This project demonstrates a **complete full-stack workflow**, including frontend UI, backend APIs, and database integration — making it a strong academic submission.

---
