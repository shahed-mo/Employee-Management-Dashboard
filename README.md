Employee Management Dashboard

A full-featured Employee Management Dashboard built with React, React Query, and JSON Server. Supports CRUD operations, role-based access, and responsive UI.

🚀 Features
React Router & Protected Routes for secure navigation
Axios & Axios Interceptors for API requests and auth handling
React Query for server state management and caching
CRUD Operations for Employees (Add, View, Edit, Delete)
Role-Based Access: HR/Admin vs Regular Employees
Filtering & Searching: by department, status, and name
Material UI & Custom CSS for modern, responsive UI
JSON Server for mock backend API
📂 Tech Stack
Frontend: React, React Router, Material UI, CSS
State Management: useState, useReducer, React Query
Backend: JSON Server
HTTP Requests: Axios with interceptors
Other Libraries: react-icons, react-query, react-toastify (optional for notifications)
⚡ Installation
Clone the repository:
git clone https://github.com/shahed-mo/Employee-Management-Dashboard.git
cd employee-management
Install dependencies:
npm install
Start JSON Server:
npx json-server --watch db.json --port 3002
Start React app:
npm start

The app will run at http://localhost:3000 and JSON Server API at http://localhost:3002.

🔑 Role-Based Access
HR/Admin: Can add, edit, delete, and view all employees.
Employee: Can view only their own profile.
🛠 Features in Detail
Search & Filters: Search employees by name and filter by department or status.
Modals: Add/Edit employee forms and View employee details.
Table Actions: View, Edit, Delete buttons for each employee.
Loading & Error Handling: Using React Query loading states and error handling.
📌 Folder Structure
src/
├─ Components/        # Reusable UI components
├─ Pages/Employee/    # Employee CRUD pages
├─ Context/           # Auth context and state
├─ Axios/             # Axios instance & interceptors
├─ App.js
├─ index.js
💡 Notes
Make sure to run JSON Server before running the React app.
You can customize departments, statuses, and roles in the frontend reducer or db.json.
