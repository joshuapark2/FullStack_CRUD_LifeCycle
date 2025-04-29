# 🧑‍💻 Joshua Park — Associate Software Engineer (UX) Demo

Welcome! This is a full-stack demo application submitted for the **Associate Software Engineer, UX Engineering** role.
This application is a MERN Stack app with the purpose of guiding banking employees through the lifecycle of onboarding a client.


## 🚀 Getting Started

Follow these instructions to run the application locally:

### 🔧 Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [Java 17+](https://adoptium.net/) (compatible with Spring Boot)
- [Gradle](https://gradle.org/) (optional — wrapper included)

---

## 📁 Project Structure

```
task-tracker/
├── frontend/     # React + Vite + Redux (Port: 5174)
└── backend/      # Spring Boot (Port: 8080)
```

---

## 🖥️ Frontend

### 📍 URL  
**http://localhost:5174/**

### ▶️ Start Command

```bash
cd task-tracker/frontend
npm install
npm run start
```

---

## ⚙️ Backend

### 📍 Base API URL  
**http://localhost:8080/api/clients**

### ▶️ Start Command

```bash
cd task-tracker/backend
./gradlew bootRun
```

---

## 🧾 Notes

- CORS is enabled for local and production environments.
- Built with **React**, **Redux Toolkit**, **TailwindCSS**, **Spring Boot**, and **Gradle**.

---
