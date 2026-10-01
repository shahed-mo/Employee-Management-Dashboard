import React, { useState } from 'react';
import { IoChevronDown, IoFunnelOutline } from 'react-icons/io5';
import { IoMdAdd } from 'react-icons/io';

const OPTIONS = ['All Status', 'Pending', 'Approved', 'Rejected'];

const LeaveFilter = ({ status, onChange, shown, total, onNew }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="card p-3 itemsCenter">
      <div className="item" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <button className="btn" onClick={() => setOpen(!open)}>
          <IoFunnelOutline />
          <span>{status}</span>
          <IoChevronDown />
        </button>
        <div className="counter">
          <span>Showing {shown} of {total} requests</span>
        </div>

        {open && (
          <div className="dropdown">
            {OPTIONS.map((s) => (
              <div
                key={s}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={status === s ? 'active' : ''}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="item">
        <button className="btn addEmployee" onClick={onNew}>
          <IoMdAdd /> New Request
        </button>
      </div>
    </div>
  );
};

export default LeaveFilter;