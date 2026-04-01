import React from 'react'
import { IoMdClose,IoMdTime } from "react-icons/io";
import { LuBriefcase } from "react-icons/lu";
import { CiClock1, CiLocationOn, CiMail,CiPhone, CiUser } from "react-icons/ci";
import './employee.css'
const ViewEmployee = ({ employee, onClose,onEdit}) => {
const startDate = new Date(employee.startDate);
const now = new Date();
const years = now.getFullYear() - startDate.getFullYear();
  return (
    <div className="newEmployee view">
      
      <div className="text-header">
       <div className="info">
       <h4>Employee Profile</h4>
       <p>View detailed information about {employee.name}</p>
       </div>
        <button onClick={onEdit} className='btn'>Edit</button>
        <div className="close-icon" onClick={onClose}>
          <IoMdClose />
        </div>
      </div>
      <div className="form">
        <div className="form-header">
            <div className="inital">
                {employee.initials}
            </div>
            <div className="employee-info">
                <h3>{employee.name}</h3>
                <p>{employee.position}</p>
                <div className="flex" style={{padding:'0'}}> 
                    <span className={employee.status === 'Active' ? 'active' : 'inactive'}>
                        {employee.status}
                        </span>
                    <span className='position'><LuBriefcase/>{employee.department}</span>
                   <span className='years'><IoMdTime/>{years} years</span>
                </div>
            </div>
        </div>
         <div className="grid col2" style={{gap:'10px'}}>
                <div className="payCard">
                    <h4>Monthly Pay</h4>
                    <p>${employee.salary}</p>
                </div>
                <div className="payCard">
                    <h4>Start Date</h4>
                    <p>{employee.startDate}</p>
                </div>
            </div>
        <div className="grid Col" style={{padding:'10px'}}>
            <div className="card contact">
                <h4 style={{fontSize:'1rem'}}><CiMail style={{color:'oklch(58.5% .233 277.117)'}}/>Contact Information</h4>
                <div className="c">
                    <small><CiMail style={{color:'oklch(58.5% .233 277.117)'}}/>Email Address: </small>
                    <p>{employee.email}</p>
                </div>
                <div className="c">
                    <small><CiPhone style={{color:'oklch(58.5% .233 277.117)'}}/>Phone Number: </small>
                    <p>{employee.phone}</p>
                </div>
               <div className="c">
               <small><CiLocationOn style={{color:'oklch(58.5% .233 277.117)'}}/>Address: </small>
               <p>{employee.address}</p>
               </div>
               <div className="c">
               <small><CiLocationOn style={{color:'oklch(58.5% .233 277.117)'}}/>Emergency Contact: </small>
               <p>{employee.phone}</p>
               </div>
            </div>
             <div className="card contact">
                <h4 style={{fontSize:'1rem'}}><CiMail style={{color:'oklch(58.5% .233 277.117)'}}/>Employment Details</h4>
                <div className="c">
                    <small><LuBriefcase style={{color:'oklch(58.5% .233 277.117)'}}/>Department: </small>
                    <p>{employee.department}</p>
                </div>
                <div className="c">
                    <small><CiUser style={{color:'oklch(58.5% .233 277.117)'}}/>Position: </small>
                    <p>{employee.position}</p>
                </div>
               <div className="c">
               <small><CiClock1 style={{color:'oklch(58.5% .233 277.117)'}}/>start Date: </small>
               <p>{employee.startDate}</p>
               </div>
               
            </div>
        </div>
      </div>

    </div>
  );
};

export default ViewEmployee