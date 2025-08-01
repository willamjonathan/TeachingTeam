# 📘 Teaching Team (TT)

This project was developed as a **Fullstack Development course assignment** during the last semester. The system, titled **Teaching Team (TT)**, is a multi-user platform designed to streamline the process of tutor and lab assistant applications, course management, and lecturer-candidate coordination at a university level.

---

## 🚀 Tech Stack

### 👩‍🏫 Lecturer Application System

* **Frontend**: React with TypeScript
* **Backend**: Node.js & Express using TypeORM
* **Database**: Cloud MySQL

  * Host: `209.38.26.237`
  * Port: `3306`
  * Admin: [phpMyAdmin](https://getmysql.com/)

### 🛠 Admin Dashboard (Separate Project)

* **Frontend**: React (TypeScript)
* **Backend**: GraphQL (Apollo Server) with Cloud MySQL
* **Authentication**: Simple login (admin, admin)
* **Real-time updates**: GraphQL Subscriptions (optional enhancement)
* **Testing (optional)**: Backend unit tests with descriptive comments

---

## 🧑‍💻 User Roles

### 👨‍🎓 Candidate

* Apply for **Tutor** and/or **Lab Assistant** roles (treated as separate roles).
* Can apply for multiple courses.

### 👨‍🏫 Lecturer

* Views only their **assigned courses**.
* May be assigned to **multiple courses**.
* Sees applications relevant to their courses only.

### 👩‍💼 Admin

* Has full control over the system through a **dedicated dashboard** (separate app).
* Capabilities include:

  * Assigning lecturers to courses
  * Adding/editing/deleting semester courses
  * Blocking/unblocking candidate logins
  * Viewing reports:

    * List of selected candidates per course
    * Candidates chosen for more than 3 courses
    * Candidates with no course assignments
  * Optional Feature:

    * **Real-time notification** to lecturers when a candidate becomes unavailable *(via GraphQL subscriptions)*
      OR
    * **6 contextual unit tests** with clear code comments (backend)

---

## ✅ Functional Requirements

* Full support for **multi-user access**.
* Backend compiled successfully with `npm run build` using **TypeScript**.
* **Cloud MySQL** integration using **TypeORM**.
* Clean, professional UI with meaningful content — **no lorem ipsum allowed**.
* Use of **royalty-free digital assets** only.
* All third-party libraries are **well-established and properly documented**.

---

## 📦 Project Structure

* `TT-Frontend/` – Lecturer-facing site (React + TypeScript)
* `TT-Backend/` – REST API server (Node.js + Express + TypeORM)
* `TT-Admin-Frontend/` – Admin dashboard (React + TypeScript)
* `TT-Admin-Backend/` – Admin GraphQL API (Apollo Server + MySQL)

---

## 📝 Notes

* The lecturer-course mapping is manually seeded in the database for simplified implementation.
* The admin and TT apps are **completely decoupled** and run independently.
* All database operations are executed through **Cloud MySQL**.

For admin app/react app:
	Backend: ts-node admin/backend/src/index.ts
	
	frontend: cd admin/frontend
                  npm run dev

For candidate/lecturer react app:
	Backend: ts-node user/src/backend/app.ts
	
	frontend: cd user
                  npm run dev
 
