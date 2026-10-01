import { FaRegEye } from 'react-icons/fa6';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import EmployeeCell from '../../Components/EmployeeCell';

const statusClass = (s) => {
  const v = s?.trim().toLowerCase();
  return v === 'active' ? 'active' : v === 'inactive' ? 'inactive' : 'on-leave';
};

export const employeeColumns = ({ isAdmin, onView, onEdit, onDelete }) => [
  { header: 'Name', label: 'Name', render: (e) => <EmployeeCell name={e.name} /> },
  { header: 'Email', label: 'Email', className: 'email', render: (e) => e.email },
  { header: 'Department', label: 'Department', className: 'dep', render: (e) => <span>{e.department}</span> },
  { header: 'Position', label: 'Position', className: 'position', render: (e) => e.position },
  { header: 'Status', label: 'Status', className: (e) => statusClass(e.status), render: (e) => <span>{e.status}</span> },
  {
    header: 'Start Date',
    label: 'Start Date',
    render: (e) => (e.startDate ? new Date(e.startDate).toLocaleDateString() : '-'),
  },
  {
    header: 'Actions',
    label: 'Actions',
    className: 'actions',
    render: (e) => (
      <>
        <FaRegEye className="icon1" onClick={() => onView(e)} />
        {isAdmin && (
          <>
            <FaRegEdit className="icon2" onClick={() => onEdit(e)} />
            <FaRegTrashAlt className="icon3" onClick={() => onDelete(e)} />
          </>
        )}
      </>
    ),
  },
];