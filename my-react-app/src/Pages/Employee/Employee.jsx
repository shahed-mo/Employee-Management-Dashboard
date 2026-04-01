import { useState, useReducer } from 'react';
import Pageheader from '../../Components/Pageheader';
import AddEmployee from './AddEmployee';
import ViewEmployee from './ViewEmployee';
import { FaRegEye } from "react-icons/fa6";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { IoFunnelOutline, IoChevronDown } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../Axios/AxiosInterciptor';
import './employee.css';

const department = ['All Departement', 'HR', 'Engineering', 'Sales', 'Marketing', 'Finance', 'Operations'];
const status = ['All Status', 'Active', 'Inactive', 'On Leave'];

const initialState = {
    department: 'All Departement',
    status: 'All Status',
    search: '',
    open: null
};

const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'TOGGLE_DROPDOWN':
            return { ...state, open: state.open === payload ? null : payload };
        case 'SET_DEPARTMENT':
            return { ...state, department: payload, open: null };
        case 'SET_STATUS':
            return { ...state, status: payload, open: null };
        case 'SET_SEARCH':
            return { ...state, search: payload };
        default:
            return state;
    }
};

const Employee = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [viewEmployee, setViewEmployee] = useState(null);
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setViewEmployee(false);
        setShowModal(true);
    }

    const queryClient = useQueryClient();

    const deleteEmployee = useMutation({
        mutationFn: (id) => axiosInstance.delete(`/employees/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['employees']),
    });

    const fetchEmployee = async () => {
        const response = await axiosInstance.get('/employees');
        return response.data;
    };

    const { data: employees = [], isLoading, isError, error } = useQuery({
        queryKey: ['employees'],
        queryFn: fetchEmployee
    });

    // إزالة المكررات باستخدام id
    const uniqueEmployees = Array.from(new Map(employees.map(emp => [emp.id, emp])).values());

    // فلترة البيانات
    const filteredEmployees = uniqueEmployees.filter(emp => {
        const nameMatch = emp.name?.toLowerCase().includes(state.search.toLowerCase());
        const depMatch = state.department === 'All Departement' || (emp.department?.trim().toLowerCase() === state.department.toLowerCase());
        const statusMatch = state.status === 'All Status' || (emp.status?.trim().toLowerCase() === state.status.toLowerCase());
        return nameMatch && depMatch && statusMatch;
    });

    if (isLoading) return <div className='loading'><AiOutlineLoading3Quarters className='loading-icon' />Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div className="Dashboard-container employee">
            <Pageheader
                header='Employee Management'
                text='Manage and organize your employee records'
            />

            {/* Search & Filters */}
            <div className="card p-3 itemsCenter">
                <div className="search-input">
                    <CiSearch className='search-icon' />
                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={state.search}
                        onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                    />
                </div>
                <div className="itemsCenter" style={{ gap: '1rem' }}>
                    <div className="item">
                        <button onClick={() => dispatch({ type: 'TOGGLE_DROPDOWN', payload: 'department' })} className="btn">
                            <IoFunnelOutline /><span>{state.department}</span><IoChevronDown />
                        </button>
                        {state.open === 'department' && (
                            <div className="dropdown">
                                {department.map(dep => (
                                    <div
                                        key={dep}
                                        onClick={() => dispatch({ type: 'SET_DEPARTMENT', payload: dep })}
                                        className={state.department === dep ? 'active' : ''}
                                    >
                                        {dep}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="item">
                        <button onClick={() => dispatch({ type: 'TOGGLE_DROPDOWN', payload: 'status' })} className="btn">
                            <span>{state.status}</span><IoChevronDown />
                        </button>
                        {state.open === 'status' && (
                            <div className="dropdown">
                                {status.map(stat => (
                                    <div
                                        key={stat}
                                        onClick={() => dispatch({ type: 'SET_STATUS', payload: stat })}
                                        className={state.status.toLowerCase() === stat.toLowerCase() ? 'active' : ''}
                                    >
                                        {stat}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="item">
                        <button className="btn addEmployee" onClick={() => {
                            setShowModal(true);
                            setSelectedEmployee(null);
                        }} ><IoMdAdd />Add Employee</button>
                    </div>
                </div>
            </div>

            {/* Employee Table */}
            <div className="card tabel">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Status</th>
                            <th>Start Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map(emp => (
                                <tr key={emp.id} className="table-row">
                                    <td data-label="Name">
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <span className="inital">{emp.name.split(' ').map(n => n[0]).join('')}</span>
                                            {emp.name}
                                        </div>
                                    </td>
                                    <td className='email' data-label="Email">{emp.email}</td>
                                    <td className='dep' data-label="Department"><span>{emp.department}</span></td>
                                    <td className='position' data-label="Position">{emp.position}</td>
                                    <td data-label="Status"
                                        className={
                                            emp.status?.trim().toLowerCase() === 'active' ? 'active' :
                                            emp.status?.trim().toLowerCase() === 'inactive' ? 'inactive' : 'on-leave'
                                        }>
                                        <span>{emp.status}</span>
                                    </td>
                                    <td data-label="Start Date">{new Date(emp.startDate).toLocaleDateString()}</td>
                                    <td className="actions" data-label="Actions">
                                        <FaRegEye className='icon1' onClick={() => { setViewEmployee(emp) }} />
                                        <FaRegEdit className='icon2' onClick={() => { setSelectedEmployee(emp); setShowModal(true); }} />
                                        <FaRegTrashAlt className='icon3' onClick={() => deleteEmployee.mutate(emp.id)} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No employees found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {showModal && (
                <div className="modal-overlay">
                    <AddEmployee setShowModal={setShowModal} employee={selectedEmployee} />
                </div>
            )}
            {viewEmployee && (
                <div className="modal-overlay">
                    <ViewEmployee
                        employee={viewEmployee}
                        onClose={() => setViewEmployee(null)}
                        onEdit={() => handleEdit(viewEmployee)}
                    />
                </div>
            )}
        </div>
    );
};

export default Employee;