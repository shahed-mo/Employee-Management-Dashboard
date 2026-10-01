import React from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoFunnelOutline, IoChevronDown } from 'react-icons/io5';
import { IoMdAdd } from 'react-icons/io';

export const DEPARTMENTS = ['All Departement', 'HR', 'Engineering', 'Sales', 'Marketing', 'Finance', 'Operations'];
export const STATUSES = ['All Status', 'Active', 'Inactive', 'On Leave'];

const Dropdown = ({ name, value, options, open, onToggle, onSelect, withIcon }) => (
  <div className="item">
    <button onClick={() => onToggle(name)} className="btn">
      {withIcon && <IoFunnelOutline />}
      <span>{value}</span>
      <IoChevronDown />
    </button>
    {open === name && (
      <div className="dropdown">
        {options.map((o) => (
          <div key={o} onClick={() => onSelect(o)} className={value === o ? 'active' : ''}>
            {o}
          </div>
        ))}
      </div>
    )}
  </div>
);

const EmployeeFilter = ({ state, dispatch, isAdmin, onAdd }) => (
  <div className="card p-3 itemsCenter">
    <div className="search-input">
      <CiSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search employee..."
        value={state.search}
        onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
      />
    </div>

    <div className="itemsCenter" style={{ gap: '1rem' }}>
      <Dropdown
        name="department"
        value={state.department}
        options={DEPARTMENTS}
        open={state.open}
        withIcon
        onToggle={(p) => dispatch({ type: 'TOGGLE_DROPDOWN', payload: p })}
        onSelect={(p) => dispatch({ type: 'SET_DEPARTMENT', payload: p })}
      />
      <Dropdown
        name="status"
        value={state.status}
        options={STATUSES}
        open={state.open}
        onToggle={(p) => dispatch({ type: 'TOGGLE_DROPDOWN', payload: p })}
        onSelect={(p) => dispatch({ type: 'SET_STATUS', payload: p })}
      />
      {isAdmin && (
        <div className="item">
          <button className="btn addEmployee" onClick={onAdd}>
            <IoMdAdd />
            Add Employee
          </button>
        </div>
      )}
    </div>
  </div>
);

export default EmployeeFilter;