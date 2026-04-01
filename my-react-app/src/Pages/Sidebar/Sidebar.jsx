import React, { useState } from 'react';
import { Auth } from '../../Context/Auth';
import TopNavbar from '../Header/TopNavbar';
import { NavLink, Outlet } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { HiUsers } from "react-icons/hi2";
import {  HiMenu } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { FiUsers } from "react-icons/fi";
import { CiCalendar } from "react-icons/ci";
import { IoTimeOutline,IoSettingsOutline,IoLogOutOutline  } from "react-icons/io5";
import { LuDollarSign,LuWallet  } from "react-icons/lu";
import employeeData from '../../../Employee.json';
import { useNavigate } from 'react-router-dom';
import './sidebar.css';

const SidebarLayout = () => {
  const auth = Auth();
  const navigate = useNavigate();
  const [employees] = useState(employeeData.employees);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const logout =()=>{
    auth.logout();
    navigate('/auth');
  }


  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* Hamburger for mobile */}
      <div className="hamburger" onClick={toggleSidebar}>
        <HiMenu />
      </div>

      {/* Overlay */}
      <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={closeSidebar}></div>

      {/* Sidebar */}
      <aside className={`${isOpen ? 'open' : ''}`}>
        <div className="close-btn" onClick={closeSidebar}>
          <IoMdClose />
        </div>

        <div className="containerLogo">
          <div className="logo">
            <div className="logoIcon">
              <HiUsers className='icon' style={{ fontSize: '1.25rem' }}/>
            </div>
            <div className="text">
              <h1>EMS Pro</h1>
              <p>Enterprise Edition</p>
            </div>
          </div>
        </div>

        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <NavLink 
                to='/dashboard' 
                className={({ isActive }) =>  `nav-link ${isActive ? "active" : ""}`}>
                <DashboardIcon className='icon'/><span style={{ marginLeft: '10px' }}>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to='/employee' 
                className={({ isActive }) =>  `nav-link ${isActive ? "active" : ""}`}>
                <FiUsers className='icon' style={{fontSize:'1.2rem'}}/><span style={{ marginLeft: '10px' }}>Employee <span className='count'>{employees.length}</span></span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to='/leave' 
                className={({ isActive }) =>  `nav-link ${isActive ? "active" : ""}`}>
                <CiCalendar className='icon' style={{fontSize:'1.3rem'}}/><span style={{ marginLeft: '10px' }}>Leave</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to='/attendance' 
                className={({ isActive }) =>  `nav-link ${isActive ? "active" : ""}`}>
                <IoTimeOutline className='icon' style={{fontSize:'1.2rem'}}/><span style={{ marginLeft: '10px' }}>Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to='/payroll' 
                className={({ isActive }) =>  `nav-link ${isActive ? "active" : ""}`}>
                <LuDollarSign className='icon' style={{fontSize:'1.2rem'}}/><span style={{ marginLeft: '10px' }}>Payroll</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to='/Provident' 
                className={({ isActive }) =>  `nav-link ${isActive ? "active" : ""}`}>
                <LuWallet className='icon' style={{fontSize:'1.2rem'}}/><span style={{ marginLeft: '10px' }}>Provident Fund</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to='/setting' 
                className={({ isActive }) =>  `nav-link ${isActive ? "active" : ""}`}>
                <IoSettingsOutline  className='icon' style={{fontSize:'1.2rem'}}/><span style={{ marginLeft: '10px' }}>Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="logout">
          <div className="flex">
            <div className="profile">
              <p className="inital">{auth.User?.initials}</p>
              <div className="flex1">
                {console.log("USER:", auth.User)}
                <p className="name">{auth.User?.name}</p>
                <p className="email">{auth.User?.email}</p>
              </div>
            </div>
            <div className="logoutIcon">
              <IoLogOutOutline className='icon' onClick={logout}/>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, background: 'rgb(246, 248, 252)' }}>
        <TopNavbar/>
        <Outlet/>
      </main>
    </div>
  );
};

export default SidebarLayout;