import React from 'react'
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
import employeesData from '../../../Employee.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartDashboard = () => {

  // 🔥 توحيد القيم (lowercase + trim) عشان ميبقاش فيه تكرار
  const departments = [
    ...new Set(
      employeesData.employees
        .map(emp => emp.department?.trim().toLowerCase())
        .filter(Boolean)
    )
  ];

  // ✅ حساب العدد بشكل صحيح
  const dataCount = departments.map(dep =>
    employeesData.employees.filter(
      emp => emp.department?.trim().toLowerCase() === dep
    ).length
  );

  // 🎯 نفس الشكل بس capital أول حرف
  const formattedDepartments = departments.map(
    dep => dep.charAt(0).toUpperCase() + dep.slice(1)
  );

  const DoughnutData = {
    labels: formattedDepartments,
    datasets: [
      {
        label: 'Employees by Department',
        data: dataCount,
        backgroundColor: [
          'rgb(99, 102, 241)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
          'rgb(245, 158, 11)',
          'rgb(6, 182, 212)',
          'rgb(16, 185, 129)'
        ],
        borderWidth: 2,
      }
    ]
  };

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
        text: 'Employees by Department', // 🔥 بس ضفت النص (مش هيغير الشكل)
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        }
      },
    },
  };

  return (
    <div style={{ width: '300px', height: '300px', margin: 'auto' }}>
      <Doughnut data={DoughnutData} options={options} />
    </div>
  )
}

export default ChartDashboard;