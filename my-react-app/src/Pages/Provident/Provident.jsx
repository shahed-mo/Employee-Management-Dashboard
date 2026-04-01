import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiDollarSign } from "react-icons/fi";
import { LuWallet, LuReceipt } from "react-icons/lu";
import { MdOutlineTrendingUp } from "react-icons/md";
import Pageheader from '../../Components/Pageheader';
import PayrollCard from '../Payroll/PayrollCard';
import axiosInstance from '../Axios/AxiosInterciptor';
import './provident.css';
import { Auth } from '../../Context/Auth';

const Provident = () => {
    const { User, loading } = Auth();

    const { data: providentFund = [], isLoading: pfLoading } = useQuery({
        queryKey: ['providentFund'],
        queryFn: async () => {
            const res = await axiosInstance.get('/providentFund');
            return res.data;
        }
    });

    const { data: employees = [], isLoading: empLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const res = await axiosInstance.get('/employees');
            return res.data;
        }
    });

    if (loading || pfLoading || empLoading) return <p>Loading...</p>;
    if (!User) return <p>User not logged in</p>;

    // ✅ فلترة حسب الدور
    const visiblePF = providentFund.filter(item => {
        if (User.role?.toLowerCase() === 'hr') return true;
        return item.employeeId.toString() === User.id.toString();
    });

    // 💰 format currency
    const formatCurrency = (num) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(num || 0);

    // 📊 sum helper
    const sum = (fn) => visiblePF.reduce((acc, prov) => acc + (fn(prov) || 0), 0);

    const employeeContribution = sum(prov => prov.employeeContribution);
    const employerContribution = sum(prov => prov.employerContribution);
    const totalPf = sum(prov => prov.total);

    // 📅 format month
    const formatDate = (date) => {
        if (!date) return '-';
        const d = new Date(date + "-01");
        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // 🧮 calculate PF (fallback)
    const calculatePF = (salary) => salary * 0.12;

    const cards = [
        { id: 1, request: 'Employee Contribution', moreText: 'This month', icon: <LuWallet />, money: formatCurrency(employeeContribution), type: 'total' },
        { id: 2, request: 'Employer Contribution', moreText: 'This month', money: formatCurrency(employerContribution), icon: <FiDollarSign />, type: 'blue' },
        { id: 3, request: 'Total PF', moreText: 'Combined contributions', money: formatCurrency(totalPf), icon: <MdOutlineTrendingUp />, type: 'green' }
    ];

    const policy = [
        { id: 1, par: 'Employee contribution is 12% of basic salary, deducted monthly from payroll' },
        { id: 2, par: 'Employer matches with equal 12% contribution' },
        { id: 3, par: 'Total PF accumulation provides retirement security and emergency fund access' },
    ];

    return (
        <div className='Dashboard-container leave color'>

            <Pageheader header="Provident Fund" text="Track provident fund contributions" />

            {/* Cards */}
            <div className="grid col3">
                {cards.map(card => (
                    <PayrollCard
                        key={card.id}
                        textH={card.request}
                        money={card.money}
                        moreText={card.moreText}
                        icon={card.icon}
                        type={card.type}
                    />
                ))}
            </div>

            {/* Table */}
            <div className="card tabel">
                <div className="card-header items-center">
                    <LuReceipt className='icon-header' />
                    <h4 className='card-title'>Provident Fund Records</h4>
                </div>

                <div className="tabel-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Month</th>
                                <th>Account Number</th>
                                <th>Basic Salary</th>
                                <th>Employee (12%)</th>
                                <th>Employer (12%)</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {visiblePF.map(item => {
                                const employee = employees.find(emp => emp.id == item.employeeId);

                                const employeePF = item.employeeContribution ?? calculatePF(item.basicSalary);
                                const employerPF = item.employerContribution ?? calculatePF(item.basicSalary);
                                const total = item.total ?? (employeePF + employerPF);

                                return (
                                    <tr key={item.id} className='table-row'>
                                        <td className="name" data-label="Name:">
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <span className="inital">
                                                    {employee?.name?.split(' ').map(n => n[0]).join('') || '--'}
                                                </span>
                                                {employee ? employee.name : 'Deleted Employee'}
                                            </div>
                                        </td>
                                        <td className='date' data-label="Date:"><span>{formatDate(item.month)}</span></td>
                                        <td className='AccountNumber' data-label='Account Number'><span>{item.accountNumber}</span></td>
                                        <td className='BasicSalary' data-label='Basic Salary'><span>{formatCurrency(item.basicSalary)}</span></td>
                                        <td className='employeeContribution' data-label='Employee Contribution'><span>{formatCurrency(employeePF)}</span></td>
                                        <td className='employerContribution' data-label='Employer Contribution'><span>{formatCurrency(employerPF)}</span></td>
                                        <td className='total' data-label='Total'>
                                            <span className='t'>{formatCurrency(total)}</span>
                                            <span className='status paid'>{item.status}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Policy */}
            <div className="card policy">
                <div className="card-header">
                    <h4>About Provident Fund</h4>
                </div>

                <div className="card-content">
                    {policy.map(item => (
                        <div key={item.id} className="flex">
                            <div className='circle'></div>
                            <p>{item.par}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Provident;