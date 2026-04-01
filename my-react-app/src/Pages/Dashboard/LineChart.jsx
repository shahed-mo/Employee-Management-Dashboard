import React from 'react';
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
import employeesData from '../../../Employee.json';
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

const LineChart = () => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const lastYear = Math.max(...employeesData.employees.map(emp=>new Date(emp.startDate).getFullYear()))
  const hiriDate = labels.map((_,index)=>{
    return employeesData.employees.filter(emp => {
        if (!emp.startDate) return false;
        const date = new Date(emp.startDate);
        return (
            date.getFullYear()===lastYear&&date.getMonth()===index
        )
    }).length
  })

  const data = {
    labels,
    datasets: [
      {
        label: 'Hiring',
        data: hiriDate,
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
      legend: {
        display: false,
      },
      title: {
        display: true,
        font: {
          size: 20,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        padding: 10,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 8,
        ticks: {
          stepSize: 2,
          font: {
            size: 12,
          },
        },
        grid: {
          color: '#eee',
        },
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