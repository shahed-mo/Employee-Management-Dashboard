import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Pageheader from '../../Components/Pageheader';
import RequestStatus from '../Leave/RequestStatus';
import { IoChevronDown, IoFunnelOutline, IoAlertCircleOutline, IoTimeOutline } from "react-icons/io5";
import { HiOutlineXCircle } from "react-icons/hi2";
import { LuCalendar } from "react-icons/lu";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import axiosInstance from '../Axios/AxiosInterciptor';
import '../Leave/leave.css';
import './attendance.css';
import { Auth } from '../../Context/Auth';

const Attendance = () => {
  const { User, loading } = Auth();

  const [status, setStatus] = useState('All Status');
  const [open, setOpen] = useState(false);

  const { data: attendance = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const res = await axiosInstance.get('/attendance');
      return res.data;
    },
  });

  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await axiosInstance.get('/employees');
      return res.data;
    },
  });

  useEffect(() => {
    console.log('USER:', User);
  }, [User]);

  const calcHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);
    return ((outH * 60 + outM - (inH * 60 + inM)) / 60).toFixed(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // ✅ حالات التحميل
  if (loading || attendanceLoading || employeesLoading) {
    return <p>Loading...</p>;
  }

  if (!User) {
    return <p>User not logged in</p>;
  }

  // ✅ فلترة حسب اليوزر
  const visibleAttendance = attendance.filter(item => {
    if (User.role?.toLowerCase() === 'hr') return true;
    return item.employeeId.toString() === User.id.toString();
  });

  // ✅ فلترة حسب الحالة
  const filteredAttendance = visibleAttendance.filter(item => {
    if (status === 'All Status') return true;
    return item.status.toLowerCase() === status.toLowerCase();
  });

  // ✅ counts
  const counts = visibleAttendance.reduce((acc, curr) => {
    const s = curr.status.toLowerCase();
    if (s === 'present') acc.present++;
    if (s === 'absent') acc.absent++;
    if (s === 'half day') acc.halfDay++;
    acc.totalHours += curr.workHours || 0;
    return acc;
  }, { present: 0, absent: 0, halfDay: 0, totalHours: 0 });

  const cards = [
    { id: 1, request: 'Present', number: counts.present, icon: <IoMdCheckmarkCircleOutline /> },
    { id: 2, request: 'Absent', number: counts.absent, icon: <HiOutlineXCircle /> },
    { id: 3, request: 'Half Day', number: counts.halfDay, icon: <IoAlertCircleOutline /> },
    { id: 4, request: 'Total Hours', number: counts.totalHours.toFixed(1), icon: <IoTimeOutline /> },
  ];

  return (
    <div className="Dashboard-container leave">

      <Pageheader
        header="Attendance Tracking"
        text="Track daily attendance and work hours"
      />

      {/* ✅ Cards */}
      <div className="grid">
        {cards.map(item => (
          <RequestStatus key={item.id} {...item} />
        ))}
      </div>

      {/* ✅ Filter */}
      <div className="card p-3 itemsCenter">
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>

          <button className="btn" onClick={() => setOpen(!open)}>
            <IoFunnelOutline />
            <span>{status}</span>
            <IoChevronDown />
          </button>

          <div className="counter">
            <span>Showing {filteredAttendance.length} of {visibleAttendance.length}</span>
          </div>

          {open && (
            <div className="dropdown">
              {['All Status', 'Present', 'Absent', 'Half Day'].map(stat => (
                <div
                  key={stat}
                  onClick={() => { setStatus(stat); setOpen(false); }}
                  className={status === stat ? 'active' : ''}
                >
                  {stat}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Table */}
      <div className="card tabel">
        <div className="card-header items-center">
          <LuCalendar className='icon-header' />
          <h4 className='card-title'>Attendance Records</h4>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredAttendance.map(item => {
                const employee = employees.find(emp => emp.id == item.employeeId);

                return (
                  <tr key={item.id} className="table-row">

                    <td className="name">
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className="inital">
                          {employee?.name?.split(' ').map(n => n[0]).join('')}
                        </span>
                        {employee?.name || 'Unknown'}
                      </div>
                    </td>

                    <td className='date'>{formatDate(item.date)}</td>

                    <td>
                      <IoTimeOutline style={{ color: '#16a34a' }} />
                      {item.checkIn}
                    </td>

                    <td>
                      <IoTimeOutline style={{ color: '#dc2626' }} />
                      {item.checkOut}
                    </td>

                    <td className='hours'>
                      {calcHours(item.checkIn, item.checkOut)}h
                    </td>

                    <td className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>
                     <span> {item.status}</span>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};

export default Attendance;