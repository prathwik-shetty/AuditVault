# 🔐 AuditVault

## Secure Document Management with Audit Logging & Integrity Tracking

AuditVault is a full-stack secure document management application developed as an **external internship project** in the domain of **Information Security, Data Governance, and Audit Logging**.

The application allows authenticated users to create, view, update, and delete sensitive text-based memos while automatically recording every memo operation in a separate audit log through **Express middleware**.

---

## 📌 Project Overview

Traditional CRUD applications generally focus on the current state of stored data. AuditVault adds an accountability and traceability layer by automatically recording user activity.

Whenever an authenticated user performs an operation on a memo, the backend generates an audit record containing:

- Memo ID
- Action Type
- Timestamp
- Authenticated User ID
- IP Address

Supported operations:

- `CREATE`
- `READ`
- `UPDATE`
- `DELETE`

The audit process is implemented at the **Express middleware layer**, making audit logging automatic and independent of frontend behavior.

---

## 🎯 Objectives

- Build a secure authenticated document management system.
- Implement complete CRUD functionality for sensitive memos.
- Enforce user ownership and authorization.
- Automatically record memo activity using backend middleware.
- Store audit records separately from application data.
- Provide an easy-to-use Audit Trail.
- Demonstrate secure backend architecture and data governance.
- Deploy the application to a public cloud environment.

---

## ✨ Key Features

### 🔐 Authentication

- Firebase Email/Password Authentication
- User registration
- User login and logout
- Firebase ID token verification
- Protected backend routes

### 📝 Secure Memo Management

- Create sensitive memos
- View memo details
- Edit existing memos
- Delete memos
- User-specific memo ownership
- Persistent MongoDB storage

### 📜 Automatic Audit Logging

Every memo route is connected to audit middleware.

| Operation | Endpoint | Audit Action |
|---|---|---|
| Create | `POST /api/memos` | `CREATE` |
| Read All | `GET /api/memos` | `READ` |
| Read One | `GET /api/memos/:id` | `READ` |
| Update | `PUT /api/memos/:id` | `UPDATE` |
| Delete | `DELETE /api/memos/:id` | `DELETE` |

The middleware automatically creates the corresponding `AuditLog` record before the JSON response is sent.

### 🔎 Audit Trail

The application provides an audit trail for individual memos showing:

- Action Type
- User ID
- Timestamp
- IP Address

### 🔗 Integrity Tracking

Audit records can contain integrity-related fields such as:

- `previousHash`
- `currentHash`

These provide a foundation for tamper-evident audit tracking.

### ☁️ Cloud Deployment

- React frontend deployed online
- Express backend deployed online
- MongoDB Atlas cloud database
- Firebase Authentication
- GitHub source control
- Render deployment

---

# 🏗️ System Architecture

```text
                         ┌───────────────────────────┐
                         │       React Frontend      │
                         │     Secure Dashboard      │
                         └─────────────┬─────────────┘
                                       │
                                       │ Firebase ID Token
                                       ▼
                         ┌───────────────────────────┐
                         │     Express Backend       │
                         │        Node.js             │
                         └─────────────┬─────────────┘
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │ Authentication Middleware  │
                         │   Firebase Token Verify    │
                         └─────────────┬─────────────┘
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │      Audit Middleware      │
                         │ CREATE / READ / UPDATE /  │
                         │ DELETE                     │
                         └─────────────┬─────────────┘
                                       │
                          ┌────────────┴────────────┐
                          ▼                         ▼
                ┌──────────────────┐      ┌──────────────────┐
                │  Memo Routes     │      │  Audit Logging   │
                │  CRUD Operations │      │  AuditLog Write  │
                └─────────┬────────┘      └─────────┬────────┘
                          │                         │
                          ▼                         ▼
                ┌──────────────────┐      ┌──────────────────┐
                │      Memos       │      │    AuditLogs     │
                │    Collection    │      │    Collection    │
                └─────────┬────────┘      └─────────┬────────┘
                          │                         │
                          └────────────┬────────────┘
                                       ▼
                              ┌──────────────────┐
                              │  MongoDB Atlas   │
                              └──────────────────┘
project structure 

AuditVault/
│
├── client----template/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Login.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── auditMiddleware.js
│   │
│   ├── models/
│   │   ├── Memo.js
│   │   └── AuditLog.js
│   │
│   ├── routes/
│   │   ├── memoRoutes.js
│   │   └── auditRoutes.js
│   │
│   ├── firebaseAdmin.js
│   ├── server.js
│   └── package.json
│
└── README.md
