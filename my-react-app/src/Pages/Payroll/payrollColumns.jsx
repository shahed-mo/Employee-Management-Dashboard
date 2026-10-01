import { LuReceipt } from 'react-icons/lu';
import EmployeeCell from '../../Components/EmployeeCell';
import { formatDate } from './payrollUtils';

// getEmployee(row) بترجّع الموظف (من الـ Map للأدمن، أو User للموظف)
export const payrollColumns = (getEmployee) => [
  { header: 'Employee', label: 'Name:', className: 'name', render: (r) => <EmployeeCell name={getEmployee(r)?.name} /> },
  { header: 'Month', label: 'Date:', className: 'date', render: (r) => <span>{formatDate(r.month)}</span> },
  { header: 'Basic', className: 'basic', render: (r) => <span>${r.basic}</span> },
  { header: 'Allowance', className: 'allowance', render: (r) => <span>+${r.allowances}</span> },
  { header: 'PF', className: 'pf', render: (r) => <span>-${r.pf}</span> },
  { header: 'Tax', className: 'tax', render: (r) => <span>-${r.tax}</span> },
  { header: 'Other', className: 'other', render: (r) => <span>-${r.other}</span> },
  { header: 'Net Salary', className: 'netSalary', render: (r) => <span>${r.netSalary}</span> },
  {
    header: 'Status',
    className: (r) => `status ${(r.status || '').toLowerCase()}`,
    render: (r) => <span>{r.status}</span>,
  },
  {
    header: 'Actions',
    className: 'actions',
    render: () => (
      <button className="btn v">
        <LuReceipt />
        View
      </button>
    ),
  },
];