import React from 'react'
import employeesData from '../../../Employee.json';

const DepartmentOverview = () => {

    const departments = [
        ...new Set(
            employeesData.employees
                .map(emp => emp.department?.trim().toLowerCase())
                .filter(Boolean)
        )
    ];

    const total = employeesData.employees.filter(emp => emp.department).length;

    const data = departments.map((dep) => {

        const count = employeesData.employees.filter(
            (emp) => emp.department?.trim().toLowerCase() === dep
        ).length;

        const percent = Math.round((count / total) * 100);

        return {
            count,
            percent,
            dep: dep.charAt(0).toUpperCase() + dep.slice(1)
        };
    });

    return (
        <div className="department">
            {data.map((item, index) => {
                return (
                    <div className="row" key={index}>
                        <div className={`badge color-${index}`}>
                            {item.count}
                        </div>

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
                )
            })}
        </div>
    )
}

export default DepartmentOverview;