import React, { useMemo } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { usePayroll } from './usePayroll';
import { formatCurrency } from './payrollUtils';
import { payrollColumns } from './payrollColumns';
import PayrollCard from './PayrollCard';
import DataTable from '../../Components/DataTable';
import FundC from './FundC';
import Pageheader from '../../Components/Pageheader';
import { FiDollarSign } from 'react-icons/fi';
import { LuReceipt } from 'react-icons/lu';
import { MdOutlineTrendingUp, MdOutlineTrendingDown } from 'react-icons/md';
import { Auth } from '../../Context/Auth';
import './payroll.css';
import '../../Components/spinner.css';

const Funds = [
  { id: 1, header: 'Earnings', icon: <MdOutlineTrendingUp />, s1: 'Basic Salary', s2: 'Primary component', s3: 'Allowance', s4: 'HRA, DA, Transport', type: 'green' },
  { id: 2, header: 'Deductions', icon: <MdOutlineTrendingDown />, s1: 'Provident Fund', s2: '12% of basic', s3: 'Income Tax', s4: 'As per slab', type: 'red' },
];

const Payroll = () => {
  const { User, loading } = Auth();
  const isAdmin = User?.role === 'admin';
  const employeeId = User?.employeeId;

  const { data: employees = [], isLoading: empLoading } = useEmployees(Boolean(User) && isAdmin);
  const { data: payroll = [], isLoading: payrollLoading } = usePayroll({
    enabled: Boolean(User),
    isAdmin,
    employeeId,
  });

  const employeesById = useMemo(
    () => new Map(employees.map((e) => [String(e.id), e])),
    [employees]
  );

  const total = useMemo(() => {
    const salaries = isAdmin
      ? employees.map((e) => Number(e.salary) || 0)
      : [Number(User?.salary) || 0];
    return salaries.reduce((a, b) => a + b, 0);
  }, [employees, isAdmin, User?.salary]);

  // لازم قبل أي early return (قواعد الـ hooks)
  const columns = useMemo(
    () => payrollColumns((r) => (isAdmin ? employeesById.get(String(r.employeeId)) : User)),
    [isAdmin, employeesById, User]
  );

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner" role="status" aria-label="Loading"></div>
      </div>
    );
  }
  if (!User) return <p>User not logged in</p>;

  // القسمة على 10 زي الكود الأصلي
  const cards = [
    { id: 1, request: 'Total Payroll', moreText: 'Gross salaries', number: formatCurrency(total / 10), icon: <FiDollarSign />, type: 'green' },
    { id: 2, request: 'Total Allowance', moreText: 'Additional benefits', number: formatCurrency((total * 0.1) / 10), icon: <MdOutlineTrendingUp />, type: 'blue' },
    { id: 3, request: 'Total Deduction', moreText: 'PF, Tax & Others', number: formatCurrency((total * 0.2) / 10), icon: <MdOutlineTrendingDown />, type: 'red' },
  ];

  return (
    <div className="Dashboard-container leave">
      <Pageheader header="Payroll Management" text="Manage salary disbursements and payslips" />

      <div className="grid col3">
        {cards.map((c) => (
          <PayrollCard
            key={c.id}
            textH={c.request}
            moreText={c.moreText}
            money={c.number}
            icon={c.icon}
            type={c.type}
          />
        ))}
      </div>

      <DataTable
        title="Payroll Records"
        icon={<LuReceipt className="icon-header" />}
        columns={columns}
        rows={payroll}
        loading={payrollLoading || (isAdmin && empLoading)}
        emptyText={isAdmin ? 'No payroll records yet.' : 'You have no payroll records yet.'}
      />

      <div className="grid col2" style={{ marginTop: '30px' }}>
        {Funds.map((f) => (
          <FundC key={f.id} header={f.header} type={f.type} icon={f.icon} s1={f.s1} s2={f.s2} s3={f.s3} s4={f.s4} />
        ))}
      </div>
    </div>
  );
};

export default Payroll;