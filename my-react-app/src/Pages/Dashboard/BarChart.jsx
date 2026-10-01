import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const salaryRanges = [
  { label: '50-70k', min: 50000, max: 69999 },
  { label: '70-90k', min: 70000, max: 89999 },
  { label: '90-110k', min: 90000, max: 109999 },
  { label: '110k+', min: 110000, max: Infinity },
];

const BarChart = () => {
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'employees'));
        if (cancelled) return;
        setSalaries(
          snap.docs
            .map((d) => Number(d.data().salary))
            .filter((s) => !isNaN(s))
        );
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(
    () =>
      salaryRanges.map(
        (range) => salaries.filter((s) => s >= range.min && s <= range.max).length
      ),
    [salaries]
  );

  const avgSalary = useMemo(
    () =>
      salaries.length
        ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
        : 0,
    [salaries]
  );

  const data = {
    labels: salaryRanges.map((r) => r.label),
    datasets: [
      {
        label: 'Employees',
        data: counts,
        backgroundColor: ['rgb(99, 102, 241)'],
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        font: { size: 18, weight: 'bold' },
        padding: { top: 10, bottom: 20 }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Employees: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  return (
    <div style={{ width: '300px', margin: 'auto', textAlign: 'center', padding: '20px' }}>
      <div style={{ height: '250px' }}>
        <Bar data={data} options={options} />
      </div>

      <p style={{ marginTop: '1px', fontSize: '16px', fontWeight: '300' }}>
        Average: ${avgSalary.toLocaleString()}
      </p>
    </div>
  );
};

export default BarChart;