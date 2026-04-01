import React from 'react';
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
import employeesData from '../../../Employee.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {

  const salaryRanges = [
    { label: '50-70k', min: 50000, max: 69999 },
    { label: '70-90k', min: 70000, max: 89999 },
    { label: '90-110k', min: 90000, max: 109999 },
    { label: '110k+', min: 110000, max: Infinity },
  ];

  const counts = salaryRanges.map(range => 
    employeesData.employees.filter(emp => emp.salary >= range.min && emp.salary <= range.max).length
  );

  const salaries = employeesData.employees.map(emp => emp.salary);
  const avgSalary = (salaries.reduce((a,b) => a+b, 0) / salaries.length).toFixed(0);

  const data = {
    labels: salaryRanges.map(r => r.label),
    datasets: [
      {
        label: 'Employees',
        data: counts,
        backgroundColor: [
          'rgb(99, 102, 241)',
        ],
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 👈 مهم زي الدونات
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Employees: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div style={{ width: '300px', margin: 'auto', textAlign: 'center',padding:'20px' }}>
    
    <div style={{ height: '250px' }}>
      <Bar data={data} options={options} />
    </div>

    <p style={{ marginTop: '1px',fontSize:'16px',fontWeight:'300'}}>
      Average: ${avgSalary}
    </p>

  </div>
  );
};

export default BarChart;