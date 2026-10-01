import React, { lazy, Suspense } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Sidebar from './Pages/Sidebar/Sidebar';
import RequireLogin from './Components/RequireLogin';
import RequireRole from './Components/RequireRole';
import AuthPage from './Pages/AuthPage/AuthPage';
import './Components/spinner.css';

const Dashboard = lazy(() => import('./Pages/Dashboard/Dashboard'));
const Employeen = lazy(() => import('./Pages/Employee/Employee'));
const Leave = lazy(() => import('./Pages/Leave/Leave'));
const Attendance = lazy(() => import('./Pages/Attendance/Attendance'));
const Payroll = lazy(() => import('./Pages/Payroll/Payroll'));
const Provident = lazy(() => import('./Pages/Provident/Provident'));
const Setting = lazy(() => import('./Pages/setting/Setting'));

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

const PageLoader = () => (
  <div className="spinner-wrapper" style={{ height: '60vh' }}>
    <div className="spinner" role="status" aria-label="Loading"></div>
  </div>
);

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
          <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route
            path="employee"
            element={
              <RequireRole role="admin">
                <Suspense fallback={<PageLoader />}>
                  <Employeen />
                </Suspense>
              </RequireRole>
            }
          />
          <Route path="leave" element={<Suspense fallback={<PageLoader />}><Leave /></Suspense>} />
          <Route path="attendance" element={<Suspense fallback={<PageLoader />}><Attendance /></Suspense>} />
          <Route path="payroll" element={<Suspense fallback={<PageLoader />}><Payroll /></Suspense>} />
          <Route path="provident" element={<Suspense fallback={<PageLoader />}><Provident /></Suspense>} />
          <Route path="setting" element={<Suspense fallback={<PageLoader />}><Setting /></Suspense>} />
        </Route>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;