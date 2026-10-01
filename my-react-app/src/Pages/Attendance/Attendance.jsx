import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import Pageheader from '../../Components/Pageheader';
import RequestStatus from '../Leave/RequestStatus';
import { IoChevronDown, IoFunnelOutline, IoAlertCircleOutline, IoTimeOutline } from 'react-icons/io5';
import { HiOutlineXCircle } from 'react-icons/hi2';
import { LuCalendar } from 'react-icons/lu';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import '../Leave/leave.css';
import './attendance.css';
import { Auth } from '../../Context/Auth';

const calcHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return '0.0';
  const [inH, inM] = checkIn.split(':').map(Number);
  const [outH, outM] = checkOut.split(':').map(Number);
  if ([inH, inM, outH, outM].some(isNaN)) return '0.0';
  return ((outH * 60 + outM - (inH * 60 + inM)) / 60).toFixed(1);
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '-';

const Attendance = () => {
  const { User, loading } = Auth();
  const isAdmin = User?.role === 'admin';
  const employeeId = User?.employeeId;

  const [status, setStatus] = useState('All Status');
  const [open, setOpen] = useState(false);

  // الأدمن يجيب الكل، الموظف يجيب سجلاته بس (عشان الـ rules)
  const { data: attendance = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance', isAdmin ? 'all' : employeeId],
    enabled: Boolean(User),
    queryFn: async () => {
      const base = collection(db, 'attendance');
      const q = isAdmin ? base : query(base, where('employeeId', '==', String(employeeId)));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  });

  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    enabled: Boolean(User),
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'employees'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  });

  const employeesById = useMemo(
    () => new Map(employees.map((e) => [String(e.id), e])),
    [employees]
  );

  const filteredAttendance = useMemo(
    () =>
      attendance.filter(
        (item) => status === 'All Status' || item.status?.toLowerCase() === status.toLowerCase()
      ),
    [attendance, status]
  );

  const counts = useMemo(
    () =>
      attendance.reduce(
        (acc, curr) => {
          const s = curr.status?.toLowerCase();
          if (s === 'present') acc.present++;
          if (s === 'absent') acc.absent++;
          if (s === 'half day') acc.halfDay++;
          acc.totalHours += Number(curr.workHours) || 0;
          return acc;
        },
        { present: 0, absent: 0, halfDay: 0, totalHours: 0 }
      ),
    [attendance]
  );

  if (loading || attendanceLoading || employeesLoading) return <p>Loading...</p>;
  if (!User) return <p>User not logged in</p>;

  const cards = [
    { id: 1, request: 'Present', number: counts.present, icon: <IoMdCheckmarkCircleOutline /> },
    { id: 2, request: 'Absent', number: counts.absent, icon: <HiOutlineXCircle /> },
    { id: 3, request: 'Half Day', number: counts.halfDay, icon: <IoAlertCircleOutline /> },
    { id: 4, request: 'Total Hours', number: counts.totalHours.toFixed(1), icon: <IoTimeOutline /> },
  ];

  return (
    <div className="Dashboard-container leave">
      <Pageheader header="Attendance Tracking" text="Track daily attendance and work hours" />

      <div className="grid">
        {cards.map((item) => (
          <RequestStatus key={item.id} {...item} />
        ))}
      </div>

      <div className="card p-3 itemsCenter">
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button className="btn" onClick={() => setOpen(!open)}>
            <IoFunnelOutline />
            <span>{status}</span>
            <IoChevronDown />
          </button>

          <div className="counter">
            <span>Showing {filteredAttendance.length} of {attendance.length}</span>
          </div>

          {open && (
            <div className="dropdown">
              {['All Status', 'Present', 'Absent', 'Half Day'].map((stat) => (
                <div
                  key={stat}
                  onClick={() => {
                    setStatus(stat);
                    setOpen(false);
                  }}
                  className={status === stat ? 'active' : ''}
                >
                  {stat}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card tabel">
        <div className="card-header items-center">
          <LuCalendar className="icon-header" />
          <h4 className="card-title">Attendance Records</h4>
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
  {filteredAttendance.length === 0 ? (
    <tr>
      <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#717182' }}>
        {attendance.length === 0
          ? isAdmin
            ? 'No attendance records yet.'
            : 'You have no attendance records yet.'
          : `No ${status.toLowerCase()} records found.`}
      </td>
    </tr>
  ) : (
    filteredAttendance.map((item) => {
      const employee = employeesById.get(String(item.employeeId));
      const s = (item.status || '').toLowerCase().replace(' ', '-');

      return (
        <tr key={item.id} className="table-row">
          <td className="name">
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span className="inital">
                {(employee?.name || '').split(' ').filter(Boolean).map((n) => n[0]).join('')}
              </span>
              {employee?.name || 'Unknown'}
            </div>
          </td>

          <td className="date">{formatDate(item.date)}</td>

          <td>
            <IoTimeOutline style={{ color: '#16a34a' }} />
            {item.checkIn}
          </td>

          <td>
            <IoTimeOutline style={{ color: '#dc2626' }} />
            {item.checkOut}
          </td>

          <td className="hours">{calcHours(item.checkIn, item.checkOut)}h</td>

          <td className={`status ${s}`}>
            <span>{item.status}</span>
          </td>
        </tr>
      );
    })
  )}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;