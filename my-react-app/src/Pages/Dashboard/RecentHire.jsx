import React from 'react'
import employeesData from '../../../Employee.json';
import { IoTimeOutline } from "react-icons/io5";

const RecentHire = () => {
    const lastestEmployee = [...employeesData.employees]
    .sort((a,b)=>new Date(b.startDate)-new Date(a.startDate)).slice(0,5)
  return (
    <div className='hire'>
        {lastestEmployee.map((emp, index) => (
          <div key={index} className='data'>
            <p className='inital' style={{textTransform:'uppercase'}}> {emp.name.split(' ').map(n=>n[0]).join('')}</p>
            <div className="Ename">
              <p className='name'>{emp.name}</p>
            <small>{emp.position}</small>
            </div>
            <div className="time" style={{display:'flex',gap:'3px'}}>
              <IoTimeOutline/>
              <p>{new Date(emp.startDate).toLocaleDateString('en-US', {month: 'short',day: 'numeric',})}</p>
              </div>
    </div>
  ))}
    </div>
  )
}

export default RecentHire