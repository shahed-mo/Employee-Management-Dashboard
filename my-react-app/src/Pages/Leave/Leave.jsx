import React, { useMemo, useState } from 'react';
import { IoTimeOutline } from 'react-icons/io5';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { HiOutlineXCircle } from 'react-icons/hi2';
import { LuCalendar } from 'react-icons/lu';
import Pageheader from '../../Components/Pageheader';
import DataTable from '../../Components/DataTable';
import RequestStatus from './RequestStatus';
import LeaveFilter from './LeaveFilter';
import LeaveForm from './LeaveForm';
import { useLeave } from './useLeave';
import { leaveColumns } from './leaveColumns';
import { useEmployees } from '../../hooks/useEmployees';
import { Auth } from '../../Context/Auth';
import './leave.css';
import '../../Components/spinner.css';

const Leave = () => {
  const { User } = Auth();
  const isAdmin = User?.role === 'admin';

  const [status, setStatus] = useState('All Status');
  const [openForm, setOpenForm] = useState(false);

  const { leave, counts, isLoading, changeStatus, createRequest } = useLeave({
    enabled: Boolean(User),
    isAdmin,
    employeeId: User?.employeeId,
  });

  // الأدمن بس يحتاج كل الموظفين (للأسماء)، الموظف اسمه في User
  const { data: employees = [] } = useEmployees(Boolean(User) && isAdmin);
  const employeesById = useMemo(
    () => new Map(employees.map((e) => [String(e.id), e])),
    [employees]
  );

  const filtered = useMemo(
    () => leave.filter((l) => status === 'All Status' || l.status?.toLowerCase() === status.toLowerCase()),
    [leave, status]
  );

  const columns = useMemo(
    () =>
      leaveColumns({
        getEmployee: (r) => (isAdmin ? employeesById.get(String(r.employeeId)) : User),
        isAdmin,
        onChangeStatus: changeStatus.mutate,
        busy: changeStatus.isPending,
      }),
    [isAdmin, employeesById, User, changeStatus.mutate, changeStatus.isPending]
  );

  const emptyText =
    leave.length === 0
      ? isAdmin
        ? 'No leave requests yet.'
        : "You haven't requested any leave yet. Click “New Request” to submit one."
      : `No ${status.toLowerCase()} requests found.`;

  const cards = [
    { id: 1, request: 'Pending Requests', number: counts.pending, icon: <IoTimeOutline /> },
    { id: 2, request: 'Approved', number: counts.approved, icon: <IoMdCheckmarkCircleOutline /> },
    { id: 3, request: 'Rejected', number: counts.rejected, icon: <HiOutlineXCircle /> },
  ];

  return (
    <div className="Dashboard-container leave">
      <Pageheader header="Leave Management" text="Review and approve employee leave requests" />

      <div className="grid col3">
        {cards.map((c) => (
          <RequestStatus key={c.id} request={c.request} number={c.number} icon={c.icon} />
        ))}
      </div>

      <LeaveFilter
        status={status}
        onChange={setStatus}
        shown={filtered.length}
        total={leave.length}
        onNew={() => setOpenForm(true)}
      />

      <DataTable
        title="Leave Requests"
        icon={<LuCalendar className="icon-header" />}
        columns={columns}
        rows={filtered}
        loading={isLoading}
        emptyText={emptyText}
      />

      {openForm && (
        <LeaveForm onClose={() => setOpenForm(false)} onSubmit={createRequest.mutateAsync} />
      )}
    </div>
  );
};

export default Leave;