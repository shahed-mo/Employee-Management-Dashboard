import EmployeeCell from '../../Components/EmployeeCell';
import { formatCurrency, formatMonth } from './providentUtils';

export const providentColumns = (getEmployee) => [
  {
    header: 'Employee',
    label: 'Name:',
    className: 'name',
    render: (r) => <EmployeeCell name={getEmployee(r)?.name} fallback="Deleted Employee" />,
  },
  { header: 'Month', label: 'Date:', className: 'date', render: (r) => <span>{formatMonth(r.month)}</span> },
  { header: 'Account Number', className: 'AccountNumber', render: (r) => <span>{r.accountNumber}</span> },
  { header: 'Basic Salary', className: 'BasicSalary', render: (r) => <span>{formatCurrency(r.basicSalary)}</span> },
  { header: 'Employee (12%)', label: 'Employee Contribution', className: 'employeeContribution', render: (r) => <span>{formatCurrency(r.employeePF)}</span> },
  { header: 'Employer (12%)', label: 'Employer Contribution', className: 'employerContribution', render: (r) => <span>{formatCurrency(r.employerPF)}</span> },
  {
    header: 'Total',
    className: 'total',
    render: (r) => (
      <>
        <span className="t">{formatCurrency(r.total)}</span>
        <span className="status paid">{r.status}</span>
      </>
    ),
  },
];