import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase'; 
import { IoTimeOutline } from "react-icons/io5";

const RecentHire = () => {
  const [latestEmployees, setLatestEmployees] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, 'employees'), orderBy('startDate', 'desc'), limit(5))
        );
        if (!cancelled) setLatestEmployees(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className='hire'>
      {latestEmployees.map((emp) => (
        <div key={emp.id} className='data'>
          <p className='inital' style={{ textTransform: 'uppercase' }}>
            {(emp.name || '').split(' ').map((n) => n[0]).join('')}
          </p>
          <div className="Ename">
            <p className='name'>{emp.name}</p>
            <small>{emp.position}</small>
          </div>
          <div className="time" style={{ display: 'flex', gap: '3px' }}>
            <IoTimeOutline />
            <p>
              {emp.startDate
                ? new Date(emp.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : '-'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentHire;