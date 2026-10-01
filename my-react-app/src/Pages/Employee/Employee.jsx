import { useMemo, useReducer, useState } from 'react';
import Pageheader from '../../Components/Pageheader';
import DataTable from '../../Components/DataTable';
import AddEmployee from './AddEmployee';
import ViewEmployee from './ViewEmployee';
import EmployeeFilter from './EmployeeFilter';
import { employeeColumns } from './employeeColumns';
import { useDeleteEmployee } from './useEmployeeActions';
import { useEmployees } from '../../hooks/useEmployees';
import { Auth } from '../../Context/Auth';
import './employee.css';
import '../../Components/spinner.css';

const initialState = { department: 'All Departement', status: 'All Status', search: '', open: null };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'TOGGLE_DROPDOWN':
      return { ...state, open: state.open === payload ? null : payload };
    case 'SET_DEPARTMENT':
      return { ...state, department: payload, open: null };
    case 'SET_STATUS':
      return { ...state, status: payload, open: null };
    case 'SET_SEARCH':
      return { ...state, search: payload };
    default:
      return state;
  }
};

const Employee = () => {
  const { User } = Auth();
  const isAdmin = User?.role === 'admin';

  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const { data: employees = [], isLoading, isError, error } = useEmployees(Boolean(User));
  const deleteEmployee = useDeleteEmployee();

  const filtered = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    return employees.filter((emp) => {
      const nameMatch = (emp.name || '').toLowerCase().includes(q);
      const depMatch =
        state.department === 'All Departement' ||
        emp.department?.trim().toLowerCase() === state.department.toLowerCase();
      const statusMatch =
        state.status === 'All Status' ||
        emp.status?.trim().toLowerCase() === state.status.toLowerCase();
      return nameMatch && depMatch && statusMatch;
    });
  }, [employees, state.search, state.department, state.status]);

  const openEdit = (emp) => {
    setSelectedEmployee(emp);
    setViewEmployee(null);
    setShowModal(true);
  };

  const columns = useMemo(
    () =>
      employeeColumns({
        isAdmin,
        onView: setViewEmployee,
        onEdit: openEdit,
        onDelete: (emp) => window.confirm(`Delete ${emp.name}?`) && deleteEmployee.mutate(emp.id),
      }),
    [isAdmin, deleteEmployee.mutate]
  );

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="Dashboard-container employee">
      <Pageheader header="Employee Management" text="Manage and organize your employee records" />

      <EmployeeFilter
        state={state}
        dispatch={dispatch}
        isAdmin={isAdmin}
        onAdd={() => {
          setSelectedEmployee(null);
          setShowModal(true);
        }}
      />

      <DataTable
        icon={null}
        title="Employees"
        columns={columns}
        rows={filtered}
        loading={isLoading}
        emptyText="No employees found"
      />

      {showModal && (
        <div className="modal-overlay">
          <AddEmployee setShowModal={setShowModal} employee={selectedEmployee} />
        </div>
      )}
      {viewEmployee && (
        <div className="modal-overlay">
          <ViewEmployee
            employee={viewEmployee}
            onClose={() => setViewEmployee(null)}
            onEdit={isAdmin ? () => openEdit(viewEmployee) : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default Employee;