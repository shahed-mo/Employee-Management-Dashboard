import { LuCalendar } from 'react-icons/lu';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { HiOutlineXCircle } from 'react-icons/hi2';
import EmployeeCell from '../../Components/EmployeeCell';
import { formatDate } from './leaveUtils';

export const leaveColumns = ({ getEmployee, isAdmin, onChangeStatus, busy }) => [
  { header: 'Employee', label: 'Employee:', className: 'name', render: (r) => <EmployeeCell name={getEmployee(r)?.name} /> },
  { header: 'Type', label: 'Type:', className: (r) => `type ${(r.type || '').toLowerCase()}`, render: (r) => <span>{r.type}</span> },
  {
    header: 'Duration',
    label: 'Duration:',
    className: 'duration',
    render: (r) => (
      <>
        <LuCalendar style={{ color: '#717182' }} />
        {formatDate(r.startDate)} - {formatDate(r.endDate)}
      </>
    ),
  },
  { header: 'Days', label: 'Days:', className: 'days', render: (r) => <><span>{r.days}</span> days</> },
  { header: 'Reason', label: 'Reason:', className: 'reason', render: (r) => r.reason },
  {
    header: 'Status',
    label: 'Status:',
    className: (r) => `status ${r.status?.toLowerCase()}`,
    render: (r) => <span>{r.status}</span>,
  },
  {
    header: 'Actions',
    label: 'Actions:',
    render: (r) => {
      const s = r.status?.toLowerCase();
      if (isAdmin && s === 'pending') {
        return (
          <div className="actions">
            <button className="approve" disabled={busy} onClick={() => onChangeStatus({ id: r.id, status: 'Approved' })}>
              <IoMdCheckmarkCircleOutline /> Approve
            </button>
            <button className="reject" disabled={busy} onClick={() => onChangeStatus({ id: r.id, status: 'Rejected' })}>
              <HiOutlineXCircle /> Reject
            </button>
          </div>
        );
      }
      return (
        <span className={`admin-action ${s}`}>
          {s === 'approved' ? 'Approved by Hr' : s === 'rejected' ? 'Rejected by Hr' : 'Pending'}
        </span>
      );
    },
  },
];