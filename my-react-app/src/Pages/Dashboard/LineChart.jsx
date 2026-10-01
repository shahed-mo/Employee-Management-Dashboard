import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const LineChart = () => {
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

  const hiringData = useMemo(() => {
    const dates = employees
      .filter((emp) => emp.startDate)
      .map((emp) => new Date(emp.startDate))
      .filter((d) => !isNaN(d));

    if (dates.length === 0) return labels.map(() => 0);

    const lastYear = Math.max(...dates.map((d) => d.getFullYear()));
    return labels.map(
      (_, index) =>
        dates.filter((d) => d.getFullYear() === lastYear && d.getMonth() === index).length
    );
  }, [employees]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Hiring',
        data: hiringData,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        font: { size: 20, weight: 'bold' },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        padding: 10,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        min: 0,
        max: 8,
        ticks: { stepSize: 2, font: { size: 12 } },
        grid: { color: '#eee' },
      },
    },
  };

  return (
    <div
      style={{
        width: '350px',
        height: '300px',
        margin: 'auto',
        padding: '15px',
      }}
      className='lineChart'
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;