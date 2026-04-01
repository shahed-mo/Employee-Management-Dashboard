import React from 'react'
import { useMutation,useQueryClient } from '@tanstack/react-query';
import {  FaUser } from 'react-icons/fa6'
import { IoMdClose } from "react-icons/io";
import { CiUser,CiMail,CiPhone,CiLocationOn} from "react-icons/ci";
import { LuBriefcase } from "react-icons/lu";
import './employee.css'
import { Formik , Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import FormControl  from '../../Components/FormControl';
import axiosInstance from '../Axios/AxiosInterciptor'



const options = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on leave', label: 'On Leave' },
]
const AddEmployee = ({ setShowModal,employee }) => {
  const queryClient = useQueryClient();
  const FormData = {
     FirstName: employee?.name?.split(' ')[0] || '',
    LastName: employee?.name?.split(' ')[1] || '',
    Email: employee?.email || '',
    phone: employee?.phone || '',
    Department: employee?.department || '',
    position: employee?.position || '',
    status: employee?.status || '',
    startDay: employee?.startDate || '',
    AnualSalary: employee?.salary || 0,
    Address: employee?.address || '',
    EmergyNumber: employee?.emergencyNumber || '',
  }
  const updateEmployee = useMutation({
    mutationFn:(updateData)=>axiosInstance.put(`/employees/${employee.id}`,updateData),
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      setShowModal(false);
    }
  })
  const addEmployee = async(data)=>{
    const response = await axiosInstance.post('/employees',data);
    return response.data;

  }
  const schema= Yup.object({
    FirstName: Yup.string().required('First Name is required'),
    LastName: Yup.string().required('Last Name is required'),
    Email: Yup.string().required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    position: Yup.string().required('Position is required'),
    status: Yup.string().required('Status is required'),
    startDay: Yup.string().required('Start Day is required'),
    AnualSalary: Yup.number().required('Anual Salary is required'),
    Department: Yup.string().required('Department is required'),
    Address: Yup.string().required('Address is required'),
    EmergyNumber: Yup.string().required('Emergency Number is required'),
  })
  const mutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
    },
  })
  return (
    <div className="newEmployee">
      <div className="text-header">
        <FaUser className='icon'/>
        <div className="info">
          <h4>{employee ? 'Edit Employee' : 'Add New Employee'}</h4>
          <p>
            {employee ? 'Update employee information.' : 'Fill in the details to add a new employee.'}</p>
        </div>
        <IoMdClose 
          className="close-icon" 
          onClick={() => setShowModal(false)} 
          style={{marginLeft:'auto', cursor:'pointer'}} 
        />
      </div>
      {/* Form goes here */}
      <div className="form">
        <Formik enableReinitialize
         initialValues={FormData}
         validationSchema={schema}
       onSubmit={(values, actions) => {
        const newEmployee = {
          name: values.FirstName + ' ' + values.LastName,
          initials: (values.FirstName[0] + values.LastName[0]).toUpperCase(),
          email: values.Email,
          phone: values.phone,
          position: values.position,
          status: values.status,
          startDate: values.startDay,
          salary: values.AnualSalary,
          department: values.Department,
          address: values.Address,
          emergencyNumber: values.EmergyNumber
        };
        if(employee){
          updateEmployee.mutate(newEmployee);
        }
        else{
          mutation.mutate(newEmployee);
        }
        actions.resetForm();
      }}
         >
          <Form>
            <div className='presonal-info'>
              <div className="personal_header">
                <CiUser className='icon'/>
                <h4>Personal Information</h4> 
              </div>
              <div className="inputs grid col2">
            <FormControl control='input' name='FirstName' placeholder='First Name' label='First Name' required/>
            <FormControl control='input' name='LastName' placeholder='Last Name' label='Last Name' required/>
            <FormControl control='input' name='Email' placeholder='Email' label='Email' required icon={<CiMail />}/>
            <FormControl control='input' name='phone' placeholder='Phone' label='Phone' required icon={<CiPhone />}/>
           </div>
            </div>
            <div className="Employmen-info">
              <div className="personal_header">
                <LuBriefcase className='icon'/>
                <h4>Employment Information</h4> 
              </div>
              <div className="inputs grid col2">
              <FormControl control='input' name='Department' placeholder='Department' label='Department' required/>
              <FormControl control='input' name='position' placeholder='position' label='position' required/>
              <FormControl control='input' type='number' name='AnualSalary' placeholder='Anual Salary' label='Anual Salary' required/>
              <FormControl control='input' name='startDay' placeholder='Start Day' label='Start Day' required/>
              <FormControl control='select' name='status' placeholder='Status' 
              options={options} label='Status' required className='status' />
              </div>
            </div>
            <div className="addtional-info">
              <div className="personal_header">
                <CiLocationOn className='icon'/>
                <h4>Additional Information</h4> 
              </div>
              <div className="inputs grid col2">
              <FormControl control='textarea' name='Address' placeholder='13 Street,Cairo' label='Address' required/>
              <FormControl control='input' name='EmergyNumber' placeholder='+(20)1128880455' label='Emergy Number' required/>
              </div>
            </div>
            <div className="btns">
              <button type='button' className='btn' onClick={() => setShowModal(false)}>Cancel</button>
             <button type='submit' className='btn'>
              {employee ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  )
}

export default AddEmployee