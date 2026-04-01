import React,{lazy,Suspense} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Pages/Sidebar/Sidebar';
import Dashboard from './Pages/Dashboard/Dashboard'; 
import RequireLogin from './Components/RequireLogin';
import AuthPage from './Pages/AuthPage/AuthPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import Leave from './Pages/Leave/Leave';
import Attendance from './Pages/Attendance/Attendance';
import Payroll from './Pages/Payroll/Payroll';
import Provident from './Pages/Provident/Provident';
import Setting from './Pages/setting/Setting';
import RequireRole from './Components/RequireRole ';

const Employeen = lazy(() => import('./Pages/Employee/Employee'));

const queryClient = new QueryClient();
const App = () => {
  return (
  <QueryClientProvider client={queryClient}>
      <Routes>
      <Route path='/' element={<Sidebar />}>
        <Route path='dashboard' element={<RequireLogin><Dashboard/></RequireLogin>} /> 
        <Route path='employee' element={<RequireLogin><RequireRole role={'hr'}><Suspense fallback={null}><Employeen/></Suspense></RequireRole></RequireLogin>} /> 
        <Route path='leave' element={<RequireLogin><Leave/></RequireLogin>} />
        <Route path='attendance' element={<RequireLogin><Attendance/></RequireLogin>} />
        <Route path='payroll' element={<RequireLogin><Payroll/></RequireLogin>} />
        <Route path='provident' element={<RequireLogin><Provident/></RequireLogin>} />
        <Route path='setting' element={<Setting/>} />
      </Route>
      <Route path="/auth" element={<AuthPage/>}/>
    </Routes>
        <ReactQueryDevtools initialIsOpen={false}/>

  </QueryClientProvider>
    
  );
};

export default App;