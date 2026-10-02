# Employee Management Dashboard

A full-featured **Employee Management Dashboard** built with **React, React Query, and Firebase**. The application provides employee management, authentication, role-based access control, leave management, attendance, payroll, and provident fund management through a responsive and modern interface.

## 🚀 Features

* **Firebase Authentication** for secure login and registration
* **Cloud Firestore** for storing employee and HR-related data
* **Role-Based Access Control**

  * Admin: manage employees and HR records
  * Employee: access their own personal HR data
* **Firestore Security Rules** to enforce data access at the database level
* **React Router** with protected routes
* **React Query** for server state management, caching, and data synchronization
* **Employee CRUD Operations**

  * Add employees
  * View employee details
  * Edit employee information
  * Delete employees
* **Leave Management**

  * Employees can submit leave requests
  * Admins can approve or reject requests
* **Attendance Management** with user-specific records
* **Payroll Management** with user-specific payroll data
* **Provident Fund Management**
* **Search and Filtering**

  * Search by employee name
  * Filter by department
  * Filter by employment status
* **Reusable Components** including shared data tables and form components
* **Form Validation** using Formik and Yup
* **Loading and Empty States** for better user experience
* **Responsive UI** using Material UI, Bootstrap, and custom CSS
* **Charts and Data Visualization** using Chart.js

## 🛠 Tech Stack

| Area           | Technologies                                   |
| -------------- | ---------------------------------------------- |
| Frontend       | React, Vite, React Router                      |
| UI             | Material UI, Bootstrap, CSS                    |
| Backend        | Firebase Authentication, Cloud Firestore       |
| State & Data   | React Query, Context API, useState, useReducer |
| Forms          | Formik, Yup                                    |
| Charts         | Chart.js, react-chartjs-2                      |
| Icons          | react-icons                                    |
| Authentication | Firebase Authentication                        |
| Database       | Cloud Firestore                                |

## 🔐 Authentication & Authorization

The application uses **Firebase Authentication** for user registration and login.

Role-based access is implemented using both:

* Protected React routes
* Firestore Security Rules

### Admin

Admins can:

* Add employees
* Edit employees
* Delete employees
* View employee records
* Manage leave requests
* Approve or reject leave requests
* View attendance records
* View payroll records
* View provident fund records

### Employee

Employees can:

* Access their account
* View their employee information
* View their own attendance
* View their own leave records
* Submit leave requests
* View their own payroll information
* View their own provident fund information

New registrations are created with the **Employee** role. Admin access is assigned separately through Firestore.

## 📊 Employee Management

The employee management section provides complete CRUD functionality:

* Create new employees
* View employee details
* Update employee information
* Delete employees
* Search employees
* Filter employees by department
* Filter employees by status

Employee forms use **Formik** for form management and **Yup** for validation.

## 📅 Leave Management

Employees can submit leave requests through the application.

Administrators can:

* View leave requests
* Approve requests
* Reject requests

Leave data is stored in Cloud Firestore and protected using Firestore Security Rules.

## 🕒 Attendance

The attendance section provides employee-specific attendance records.

Employees can access their own attendance information, while administrators can view attendance data for employees according to their permissions.

## 💰 Payroll

The payroll section provides access to payroll information stored in Firestore.

The application uses role-based access to ensure employees can only access their permitted payroll data.

## 🏦 Provident Fund

The provident fund section manages employee provident fund information and provides access based on the user's role and permissions.

## ⚡ Data Management

**React Query** is used for server-state management.

It provides:

* Data fetching
* Query caching
* Cache invalidation
* Loading states
* Error handling
* Data synchronization between pages

Reusable hooks and components are used to keep data-fetching logic and UI code organized.

## 📁 Project Structure

```text
Employee-Management-Dashboard/
│
├─ my-react-app/
│  │
│  ├─ src/
│  │  ├─ Components/
│  │  │  ├─ DataTable/
│  │  │  ├─ EmployeeCell/
│  │  │  ├─ RequireLogin/
│  │  │  └─ RequireRole/
│  │  │
│  │  ├─ Context/
│  │  │  └─ AuthContext
│  │  │
│  │  ├─ hooks/
│  │  │  └─ useEmployees
│  │  │
│  │  ├─ Pages/
│  │  │  ├─ Dashboard/
│  │  │  ├─ Employee/
│  │  │  ├─ Leave/
│  │  │  ├─ Attendance/
│  │  │  ├─ Payroll/
│  │  │  ├─ Provident/
│  │  │  ├─ Sidebar/
│  │  │  ├─ setting/
│  │  │  └─ AuthPage/
│  │  │
│  │  ├─ firebase.js
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  │
│  ├─ scripts/
│  │  └─ seed.cjs
│  │
│  └─ ...
│
└─ README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/shahed-mo/Employee-Management-Dashboard.git
```

### 2. Navigate to the application

```bash
cd Employee-Management-Dashboard/my-react-app
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a Firebase Project

Create a Firebase project and enable:

* Firebase Authentication
* Email/Password Authentication
* Cloud Firestore

Then register a Web App and copy the Firebase configuration.

### 5. Create the `.env` file

Create a `.env` file inside `my-react-app/`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 6. Configure Firestore Security Rules

Publish the Firestore Security Rules included in the project.

These rules are responsible for enforcing role-based access at the database level.

### 7. Start the development server

```bash
npm run dev
```

The application will run at:

```text
http://localhost:5173
```

## 🌱 Optional Demo Data Seeding

The project includes a seed script for creating demo authentication users and Firestore documents.

To use it:

1. Generate a Firebase service account key from:

```text
Firebase Console → Project Settings → Service Accounts
```

2. Keep the service account key outside the repository.

3. Set the environment variable:

### Windows

```bash
set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\serviceAccountKey.json
```

4. Run:

```bash
node scripts/seed.cjs
```

> The service account key must never be committed to GitHub.

## 🔒 Environment & Security

The following files contain sensitive configuration and should not be committed:

```text
.env
Employee.json
serviceAccountKey.json
```

Make sure they are included in `.gitignore`.

Firebase Web API keys are intended to be used by browser applications, but actual data protection is handled through **Firebase Authentication and Firestore Security Rules**.

## 📱 Responsive Design

The dashboard is designed to work across:

* Desktop
* Tablet
* Mobile

The interface combines **Material UI, Bootstrap, and custom CSS** to provide a responsive user experience.

## 📈 Future Improvements

Possible future improvements include:

* Advanced employee analytics
* Exporting reports
* Notifications
* More detailed payroll calculations
* Attendance statistics
* Improved dashboard charts
* Pagination for large employee datasets

## 👩‍💻 Author

**Shahd Mohamed**

Frontend Developer | React.js

* GitHub: https://github.com/shahed-mo

## 📄 License

This project is created for educational and portfolio purposes.
