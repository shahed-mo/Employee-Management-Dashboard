# Employee Management Dashboard

A full-featured Employee Management Dashboard built with **React**, **React Query**, and **Firebase** (Authentication + Cloud Firestore). Supports CRUD operations, role-based access, and a responsive UI.

## Features

- **Firebase Authentication** for secure login and registration
- **Cloud Firestore** for employees, leave requests, attendance, payroll, and provident fund data
- **Role-based access**: Admin vs. regular Employee, enforced by Firestore Security Rules
- **React Router & Protected Routes** (`RequireLogin`, `RequireRole`)
- **React Query** for server state, caching, and shared data between pages
- **CRUD for employees**: add, view, edit, delete
- **Leave management**: employees submit requests, admins approve or reject
- **Attendance, Payroll, and Provident Fund** pages with per-user data
- **Search and filters** by name, department, and status
- **Performance**: lazy-loaded pages, shared query cache, reusable `DataTable`
- **UX**: loading spinners and clear empty states
- **Material UI, Bootstrap, and custom CSS** for a modern, responsive UI

## Tech Stack

| Area | Tools |
|---|---|
| Frontend | React, Vite, React Router, Material UI, Bootstrap, CSS |
| Backend | Firebase Authentication, Cloud Firestore |
| State / Data | React Query, useState, useReducer, Context API |
| Forms | Formik, Yup |
| Charts | Chart.js, react-chartjs-2 |
| Other | react-icons |

## Installation

1. Clone the repository:

```bash
git clone https://github.com/shahed-mo/Employee-Management-Dashboard.git
cd Employee-Management-Dashboard/my-react-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a Firebase project at https://console.firebase.google.com, then:
   - Enable **Authentication > Email/Password**
   - Create a **Firestore Database**
   - Register a **Web app** and copy its config

4. Create a `.env` file in `my-react-app/`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Publish the Firestore Security Rules (see `firestore.rules`).

6. Start the app:

```bash
npm run dev
```

The app runs at http://localhost:5173.

## Seeding Demo Data (optional)

A seed script creates Auth users and Firestore documents from a local `Employee.json`.

1. Generate a service account key from Firebase Console > Project settings > Service accounts.
2. Keep the key **outside** the repository and point to it:

```bash
set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\serviceAccountKey.json
node scripts/seed.cjs
```

`Employee.json`, `.env`, and service account keys are git-ignored and must never be committed.

## Role-Based Access

- **Admin**: add, edit, delete, and view all employees; approve or reject leave; view all attendance, payroll, and provident fund records.
- **Employee**: view the employee list, and see only their own attendance, leave, payroll, and provident fund records.
- New sign-ups are always created as **employees**; admin is assigned only from Firestore.

Access is enforced by Firestore Security Rules, not just the UI.

## Folder Structure

```
src/
├─ Components/      # Reusable UI (DataTable, EmployeeCell, RequireLogin, RequireRole)
├─ Context/         # Auth context (Firebase onAuthStateChanged)
├─ hooks/           # Shared hooks (useEmployees)
├─ Pages/           # Dashboard, Employee, Leave, Attendance, Payroll, Provident, AuthPage
├─ firebase.js      # Firebase initialization
├─ App.jsx          # Routes (lazy loaded)
└─ main.jsx
scripts/
└─ seed.cjs         # Firestore + Auth seeding script
```

## Notes

- Never commit `.env`, `Employee.json`, or service account keys.
- Review and publish the Firestore Security Rules before deploying.
- Firebase web API keys are not secrets; real protection comes from the Security Rules.