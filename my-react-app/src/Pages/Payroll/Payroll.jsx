import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../Axios/AxiosInterciptor';
import PayrollCard from './PayrollCard';
import { FiDollarSign } from "react-icons/fi";
import { MdOutlineTrendingUp, MdOutlineTrendingDown } from "react-icons/md";
import { LuReceipt } from "react-icons/lu";
import Pageheader from '../../Components/Pageheader';
import './payroll.css';
import FundC from './FundC';
import { Auth } from '../../Context/Auth';

const Payroll = () => {
    const { User, loading } = Auth();

    const { data: employees = [], isLoading: empLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const res = await axiosInstance.get('/employees');
            return res.data;
        }
    });

    const { data: payroll = [], isLoading: payrollLoading } = useQuery({
        queryKey: ['payroll'],
        queryFn: async () => {
            const res = await axiosInstance.get('/payroll');
            return res.data;
        }
    });

    if (loading || empLoading || payrollLoading) return <p>Loading...</p>;
    if (!User) return <p>User not logged in</p>;

    const visiblePayroll = payroll.filter(item => {
        if (User.role?.toLowerCase() === 'hr') return true;
        return item.employeeId.toString() === User.id.toString();
    });

    const sum = (fn) => employees.reduce((acc, emp) => acc + fn(emp), 0);
    const totalPayroll = sum(emp => emp.salary);
    const totalAllowance = sum(emp => emp.salary * 0.1);
    const totalDeduction = sum(emp => emp.salary * 0.2);

    const formatCurrency = (num) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(num);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const cards = [
        { id: 1, request: 'Total Payroll', moreText: 'Gross salaries', number: formatCurrency(totalPayroll / 10), icon: <FiDollarSign />, type: 'green' },
        { id: 2, request: 'Total Allowance', moreText: 'Additional benefits', number: formatCurrency(totalAllowance / 10), icon: <MdOutlineTrendingUp />, type: 'blue' },
        { id: 3, request: 'Total Deduction', moreText: 'PF, Tax & Others', number: formatCurrency(totalDeduction / 10), icon: <MdOutlineTrendingDown />, type: 'red' }
    ];

    const Funds = [
        { id: 1, header: 'Earnings', icon: <MdOutlineTrendingUp />, s1: 'Basic Salary', s2: 'Primary component', s3: 'Allowance', s4: 'HRA, DA, Transport', type: 'green' },
        { id: 2, header: 'Deductions', icon: <MdOutlineTrendingDown />, s1: 'Provident Fund', s2: '12% of basic', s3: 'Income Tax', s4: 'As per slab', type: 'red' }
    ];

    return (
        <div className="Dashboard-container leave">
            <Pageheader
                header='Payroll Management'
                text='Manage salary disbursements and payslips'
            />

            <div className="grid col3">
                {cards.map((item) => (
                    <PayrollCard
                        key={item.id}
                        textH={item.request}
                        moreText={item.moreText}
                        money={item.number}
                        icon={item.icon}
                        type={item.type}
                    />
                ))}
            </div>

            <div className="card tabel">
                <div className="card-header items-center">
                    <LuReceipt className='icon-header' />
                    <h4 className='card-title'>Payroll Records</h4>
                </div>

                <div className="tabel-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Month</th>
                                <th>Basic</th>
                                <th>Allowance</th>
                                <th>PF</th>
                                <th>Tax</th>
                                <th>Other</th>
                                <th>Net Salary</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visiblePayroll.map((item) => {
                                const employee = employees.find(emp => Number(emp.id) === Number(item.employeeId));
                                return (
                                    <tr key={item.id} className='table-row'>
                                        <td className="name" data-label="Name:">
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <span className="inital">
                                                    {employee?.name?.split(' ').map(n => n[0]).join('')}
                                                </span>
                                                {employee?.name || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className='date' data-label="Date:"><span>{formatDate(item.month)}</span></td>
                                        <td className='basic' data-label="Basic:"><span>${item.basic}</span></td>
                                        <td className='allowance' data-label="Allowance:"><span>+${item.allowances}</span></td>
                                        <td className='pf' data-label="PF:"><span>-${item.pf}</span></td>
                                        <td className='tax' data-label="Tax:"><span>-${item.tax}</span></td>
                                        <td className='other' data-label="Other:"><span>-${item.other}</span></td>
                                        <td className='netSalary' data-label="Net Salary:"><span>${item.netSalary}</span></td>
                                        <td className={`status ${item.status.toLowerCase()}`} data-label="Status:"><span>{item.status}</span></td>
                                        <td className="actions" data-label="Actions:">
                                            <button className="btn v"><LuReceipt />View</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid col2" style={{ marginTop: '30px' }}>
                {Funds.map((item) => (
                    <FundC key={item.id} header={item.header} type={item.type} icon={item.icon} s1={item.s1} s2={item.s2} s3={item.s3} s4={item.s4} />
                ))}
            </div>
        </div>
    );
}

export default Payroll;