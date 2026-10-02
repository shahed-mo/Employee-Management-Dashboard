import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Sidebar from './Pages/Sidebar/Sidebar';
import RequireLogin from './Components/RequireLogin';
import RequireRole from './Components/RequireRole';
import AuthPage from './Pages/AuthPage/AuthPage';
import './Components/spinner.css';

import Dashboard from './Pages/Dashboard/Dashboard';
import Employeen from './Pages/Employee/Employee';
import Leave from './Pages/Leave/Leave';
import Attendance from './Pages/Attendance/Attendance';
import Payroll from './Pages/Payroll/Payroll';
import Provident from './Pages/Provident/Provident';
import Setting from './Pages/setting/Setting';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
          path="/"
          element={
            <RequireLogin>
              <Sidebar />
            </RequireLogin>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route
            path="employee"
            element={
              <RequireRole role="admin">
                <Employeen />
              </RequireRole>
            }
          />

          <Route path="leave" element={<Leave />} />

          <Route path="attendance" element={<Attendance />} />

          <Route path="payroll" element={<Payroll />} />

          <Route path="provident" element={<Provident />} />

          <Route path="setting" element={<Setting />} />
        </Route>

        <Route path="/auth" element={<AuthPage />} />
      </Routes>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;