import React, { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase'; 

const DepartmentOverview = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'employees'));
        if (!cancelled) setEmployees(snap.docs.map((d) => d.data()));
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const data = useMemo(() => {
    const counts = new Map();
    let total = 0;

    employees.forEach((emp) => {
      const dep = emp.department?.trim().toLowerCase();
      if (!dep) return;
      counts.set(dep, (counts.get(dep) || 0) + 1);
      total += 1;
    });

    return [...counts.entries()].map(([dep, count]) => ({
      count,
      percent: Math.round((count / total) * 100),
      dep: dep.charAt(0).toUpperCase() + dep.slice(1),
    }));
  }, [employees]);

  return (
    <div className="department">
      {data.map((item, index) => (
        <div className="row" key={item.dep}>
          <div className={`badge color-${index}`}>{item.count}</div>

          <div className="info">
            <div className="top">
              <span className="name">{item.dep}</span>
              <span className="percent">{item.percent}%</span>
            </div>

            <div className="progress">
              <div
                className={`progress-fill color-${index}`}
                style={{ width: `${item.percent}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentOverview;