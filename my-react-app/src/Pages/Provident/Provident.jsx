import React, { useMemo } from 'react';
import { FiDollarSign } from 'react-icons/fi';
import { LuWallet, LuReceipt } from 'react-icons/lu';
import { MdOutlineTrendingUp } from 'react-icons/md';
import Pageheader from '../../Components/Pageheader';
import DataTable from '../../Components/DataTable';
import PayrollCard from '../Payroll/PayrollCard';
import ProvidentPolicy from './ProvidentPolicy';
import { useProvident } from './useProvident';
import { useEmployees } from '../../hooks/useEmployees';
import { providentColumns } from './providentColumns';
import { formatCurrency } from './providentUtils';
import { Auth } from '../../Context/Auth';
import './provident.css';
import '../../Components/spinner.css';

const Provident = () => {
  const { User, loading } = Auth();
  const isAdmin = User?.role === 'admin';

  const { rows, totals, isLoading: pfLoading } = useProvident({
    enabled: Boolean(User),
    isAdmin,
    employeeId: User?.employeeId,
  });

  // الأدمن بس يحتاج الأسماء، والكاش مشترك مع باقي الصفحات
  const { data: employees = [], isLoading: empLoading } = useEmployees(Boolean(User) && isAdmin);

  const employeesById = useMemo(
    () => new Map(employees.map((e) => [String(e.id), e])),
    [employees]
  );

  // لازم قبل أي early return (قواعد الـ hooks)
  const columns = useMemo(
    () => providentColumns((r) => (isAdmin ? employeesById.get(String(r.employeeId)) : User)),
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

  const cards = [
    { id: 1, request: 'Employee Contribution', moreText: 'This month', icon: <LuWallet />, money: formatCurrency(totals.employee), type: 'total' },
    { id: 2, request: 'Employer Contribution', moreText: 'This month', icon: <FiDollarSign />, money: formatCurrency(totals.employer), type: 'blue' },
    { id: 3, request: 'Total PF', moreText: 'Combined contributions', icon: <MdOutlineTrendingUp />, money: formatCurrency(totals.total), type: 'green' },
  ];

  return (
    <div className="Dashboard-container leave color">
      <Pageheader header="Provident Fund" text="Track provident fund contributions" />

      <div className="grid col3">
        {cards.map((c) => (
          <PayrollCard
            key={c.id}
            textH={c.request}
            money={c.money}
            moreText={c.moreText}
            icon={c.icon}
            type={c.type}
          />
        ))}
      </div>

      <DataTable
        title="Provident Fund Records"
        icon={<LuReceipt className="icon-header" />}
        columns={columns}
        rows={rows}
        loading={pfLoading || (isAdmin && empLoading)}
        emptyText={isAdmin ? 'No provident fund records yet.' : 'You have no provident fund records yet.'}
      />

      <ProvidentPolicy />
    </div>
  );
};

export default Provident;