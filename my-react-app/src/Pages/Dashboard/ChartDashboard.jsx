import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const colors = [
  'rgb(99, 102, 241)',
  'rgb(139, 92, 246)',
  'rgb(236, 72, 153)',
  'rgb(245, 158, 11)',
  'rgb(6, 182, 212)',
  'rgb(16, 185, 129)',
];

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 12,
        padding: 12,
      },
    },
    title: {
      display: true,
      text: 'Employees by Department',
      font: { size: 18, weight: 'bold' },
      padding: { top: 10, bottom: 20 },
    },
  },
};

const ChartDashboard = () => {
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

  // توحيد القيم (lowercase + trim) عشان ميبقاش فيه تكرار
  const { labels, counts } = useMemo(() => {
    const map = new Map();
    employees.forEach((emp) => {
      const dep = emp.department?.trim().toLowerCase();
      if (!dep) return;
      map.set(dep, (map.get(dep) || 0) + 1);
    });
    return {
      labels: [...map.keys()].map((d) => d.charAt(0).toUpperCase() + d.slice(1)),
      counts: [...map.values()],
    };
  }, [employees]);

  const DoughnutData = {
    labels,
    datasets: [
      {
        label: 'Employees by Department',
        data: counts,
        backgroundColor: colors,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div style={{ width: '300px', height: '300px', margin: 'auto' }}>
      <Doughnut data={DoughnutData} options={options} />
    </div>
  );
};

export default ChartDashboard;