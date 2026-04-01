import React from 'react'
import { Formik, Form } from 'formik';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Pageheader from '../../Components/Pageheader';
import RequestStatus from './RequestStatus';
import { IoTimeOutline, IoChevronDown, IoFunnelOutline } from "react-icons/io5";
import { IoMdCheckmarkCircleOutline, IoMdAdd } from "react-icons/io";
import { HiOutlineXCircle } from "react-icons/hi2";
import { LuCalendar } from "react-icons/lu";
import axiosInstance from '../Axios/AxiosInterciptor';
import './leave.css' 

const Leave = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [status, setStatus] = React.useState('All Status');
  const [open, setOpen] = React.useState(false);
  const [openForm, setOpenForm] = React.useState(false);

  const queryClient = useQueryClient();

  const approvedLeave = async (id) => {
    await axiosInstance.patch(`/leaveRequests/${id}`, { status: 'Approved' });
    queryClient.invalidateQueries(['leave']);
  }

  const rejectedLeave = async (id) => {
    await axiosInstance.patch(`/leaveRequests/${id}`, { status: 'Rejected' });
    queryClient.invalidateQueries(['leave']);
  }

  const { data: leave = [] } = useQuery({
    queryKey: ['leave'],
    queryFn: async () => {
      const res = await axiosInstance.get('/leaveRequests');
      return res.data;
    }
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await axiosInstance.get('/employees');
      return res.data;
    }
  });

  const leaveByRole = React.useMemo(() => {
    if (userData.role === 'employee') {
      return leave.filter(item => item.employeeId == userData.id);
    } else {
      return leave;
    }
  }, [leave, userData.role, userData.id]);

  const filteredLeave = leaveByRole.filter((item) => {
    if (status === 'All Status') return true;
    return item.status.toLowerCase() === status.toLowerCase();
  });

  const pendingCount = leaveByRole.filter(l => l.status.toLowerCase() === 'pending').length;
  const approvedCount = leaveByRole.filter(l => l.status.toLowerCase() === 'approved').length;
  const rejectedCount = leaveByRole.filter(l => l.status.toLowerCase() === 'rejected').length;

  const request = [
    { id: 1, request: 'Pending Requests', number: pendingCount, icon: <IoTimeOutline /> },
    { id: 2, request: 'Approved', number: approvedCount, icon: <IoMdCheckmarkCircleOutline /> },
    { id: 3, request: 'Rejected', number: rejectedCount, icon: <HiOutlineXCircle /> },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="Dashboard-container leave">
      <Pageheader
        header="Leave Management"
        text="Review and approve employee leave requests"
      />

      <div className="grid col3">
        {request.map((item) => (
          <RequestStatus
            key={item.id}
            request={item.request}
            number={item.number}
            icon={item.icon}
          />
        ))}
      </div>

      <div className="card p-3 itemsCenter">
        <div className="item" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button className="btn" onClick={() => setOpen(!open)}>
            <IoFunnelOutline />
            <span>{status}</span>
            <IoChevronDown />
          </button>
          <div className="counter">
            <span>Showing {filteredLeave.length} of {leaveByRole.length} requests</span>
          </div>

          {open && (
            <div className="dropdown">
              {['All Status', 'Pending', 'Approved', 'Rejected'].map((stat) => (
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

        <div className="item">
          <button className="btn addEmployee" onClick={() => setOpenForm(true)}><IoMdAdd /> New Request</button>
        </div>
      </div>

      <div className="card tabel">
        <div className="card-header items-center">
          <LuCalendar className='icon-header' />
          <h4 className='card-title'>Leave Requests</h4>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeave.map((item) => {
                const employee = employees.find(emp => emp.id == item.employeeId);

                return (
                  <tr key={item.id} className="table-row">
                    <td data-label="Employee:" className="name">
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className="inital">
                          {employee?.name?.split(' ').map(n => n[0]).join('')}
                        </span>
                        {employee?.name || 'Unknown'}
                      </div>
                    </td>

                    <td data-label="Type:" className={`type ${item.type.toLowerCase()}`}>
                      <span>{item.type}</span>
                    </td>

                    <td data-label="Duration:" className='duration'>
                      <LuCalendar style={{ color: '#717182' }} />
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </td>

                    <td data-label="Days:" className='days'>
                      <span>{item.days}</span> days
                    </td>

                    <td data-label="Reason:" className='reason'>
                      {item.reason}
                    </td>

                    <td data-label="Status:" className={`status ${item.status.toLowerCase()}`}>
                      <span>{item.status}</span>
                    </td>

                    <td data-label="Actions:">
                      {userData.role !== 'employee' && item.status.toLowerCase() === 'pending' ? (
                        <div className="actions">
                          <button className='approve' onClick={() => approvedLeave(item.id)}>
                            <IoMdCheckmarkCircleOutline /> Approve
                          </button>
                          <button className='reject' onClick={() => rejectedLeave(item.id)}>
                            <HiOutlineXCircle /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`admin-action ${item.status.toLowerCase()}`}>
                          {item.status === 'Approved'
                            ? 'Approved by Hr'
                            : item.status === 'Rejected'
                              ? 'Rejected by Hr'
                              : 'Pending'}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {openForm && (
        <>
          <div className="modal-backdrop" onClick={() => setOpenForm(false)}></div>
          <div className="modal">
            <Formik
              initialValues={{
                type: 'Annual',
                startDate: '',
                endDate: '',
                reason: '',
              }}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                if (new Date(values.startDate) > new Date(values.endDate)) {
                  alert("End date must be after start date");
                  setSubmitting(false);
                  return;
                }
                try {
                  await axiosInstance.post('/leaveRequests', {
                    ...values,
                    employeeId: userData.id,
                    status: 'Pending',
                    days: calculateDays(values.startDate, values.endDate),
                  });
                  queryClient.invalidateQueries(['leave']);
                  resetForm();
                  setOpenForm(false);
                } catch (err) {
                  console.log(err);
                }
                setSubmitting(false);
              }}
            >
              {({ handleChange, values, isSubmitting }) => (
                <Form className="leave-form">
                  <label>Type:</label>
                  <select name="type" value={values.type} onChange={handleChange}>
                    <option value="Annual">Annual</option>
                    <option value="Sick">Sick</option>
                    <option value="Other">Other</option>
                  </select>

                  <label>Start Date:</label>
                  <input type="date" name="startDate" value={values.startDate} onChange={handleChange} />

                  <label>End Date:</label>
                  <input type="date" name="endDate" value={values.endDate} onChange={handleChange} />

                  <label>Reason:</label>
                  <textarea name="reason" value={values.reason} onChange={handleChange} />

                  <button type="submit" disabled={isSubmitting}>Submit Request</button>
                  <button type="button" onClick={() => setOpenForm(false)}>Cancel</button>
                </Form>
              )}
            </Formik>
          </div>
        </>
      )}
    </div>
  )
}

export default Leave;