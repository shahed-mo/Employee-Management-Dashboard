import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUser } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import { CiUser, CiMail, CiPhone, CiLocationOn } from 'react-icons/ci';
import { LuBriefcase } from 'react-icons/lu';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import FormControl from '../../Components/FormControl';
import './employee.css';

// القيم لازم تطابق اللي الداشبورد بيعدّه ("Active" / "On Leave")
const options = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'On Leave', label: 'On Leave' },
];

const schema = Yup.object({
  FirstName: Yup.string().trim().required('First Name is required'),
  LastName: Yup.string().trim().required('Last Name is required'),
  Email: Yup.string().trim().email('Invalid email').required('Email is required'),
  phone: Yup.string().trim().required('Phone is required'),
  position: Yup.string().trim().required('Position is required'),
  status: Yup.string().required('Status is required'),
  startDay: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Use format YYYY-MM-DD')
    .required('Start Day is required'),
  AnualSalary: Yup.number().typeError('Must be a number').positive('Must be positive').required('Anual Salary is required'),
  Department: Yup.string().trim().required('Department is required'),
  Address: Yup.string().trim().required('Address is required'),
  EmergyNumber: Yup.string().trim().required('Emergency Number is required'),
});

const AddEmployee = ({ setShowModal, employee }) => {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState('');
  const isEdit = Boolean(employee);

  const [first = '', ...rest] = (employee?.name || '').trim().split(/\s+/);

  const initialValues = {
    FirstName: first,
    LastName: rest.join(' '), // يدعم الأسماء اللي أكتر من كلمتين
    Email: employee?.email || '',
    phone: employee?.phone || '',
    Department: employee?.department || '',
    position: employee?.position || '',
    status: employee?.status || '',
    startDay: employee?.startDate || '',
    AnualSalary: employee?.salary || '',
    Address: employee?.address || '',
    EmergyNumber: employee?.emergencyNumber || '',
  };

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (isEdit) {
        // الإيميل مرتبط بحساب الـ Auth، فمش بنغيّره من هنا
        const { email, ...updatable } = payload;
        await updateDoc(doc(db, 'employees', String(employee.id)), updatable);
      } else {
        await addDoc(collection(db, 'employees'), payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setShowModal(false);
    },
    onError: (e) => {
      console.error(e);
      setErrorMsg(
        e.code === 'permission-denied'
          ? "You don't have permission to do this"
          : 'Something went wrong, please try again'
      );
    },
  });

  const handleSubmit = (values) => {
    setErrorMsg('');
    mutation.mutate({
      name: `${values.FirstName.trim()} ${values.LastName.trim()}`,
      email: values.Email.trim().toLowerCase(),
      phone: values.phone.trim(),
      position: values.position.trim(),
      status: values.status,
      startDate: values.startDay,
      salary: Number(values.AnualSalary),
      department: values.Department.trim(),
      address: values.Address.trim(),
      emergencyNumber: values.EmergyNumber.trim(),
    });
  };

  return (
    <div className="newEmployee">
      <div className="text-header">
        <FaUser className="icon" />
        <div className="info">
          <h4>{isEdit ? 'Edit Employee' : 'Add New Employee'}</h4>
          <p>{isEdit ? 'Update employee information.' : 'Fill in the details to add a new employee.'}</p>
        </div>
        <IoMdClose
          className="close-icon"
          onClick={() => setShowModal(false)}
          style={{ marginLeft: 'auto', cursor: 'pointer' }}
        />
      </div>

      <div className="form">
        <Formik enableReinitialize initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit}>
          <Form>
            <div className="presonal-info">
              <div className="personal_header">
                <CiUser className="icon" />
                <h4>Personal Information</h4>
              </div>
              <div className="inputs grid col2">
                <FormControl control="input" name="FirstName" placeholder="First Name" label="First Name" required />
                <FormControl control="input" name="LastName" placeholder="Last Name" label="Last Name" required />
                <FormControl control="input" name="Email" placeholder="Email" label="Email" required icon={<CiMail />} disabled={isEdit} />
                <FormControl control="input" name="phone" placeholder="Phone" label="Phone" required icon={<CiPhone />} />
              </div>
            </div>

            <div className="Employmen-info">
              <div className="personal_header">
                <LuBriefcase className="icon" />
                <h4>Employment Information</h4>
              </div>
              <div className="inputs grid col2">
                <FormControl control="input" name="Department" placeholder="Department" label="Department" required />
                <FormControl control="input" name="position" placeholder="Position" label="Position" required />
                <FormControl control="input" type="number" name="AnualSalary" placeholder="Anual Salary" label="Anual Salary" required />
                <FormControl control="input" type="date" name="startDay" placeholder="Start Day" label="Start Day" required />
                <FormControl control="select" name="status" placeholder="Status" options={options} label="Status" required className="status" />
              </div>
            </div>

            <div className="addtional-info">
              <div className="personal_header">
                <CiLocationOn className="icon" />
                <h4>Additional Information</h4>
              </div>
              <div className="inputs grid col2">
                <FormControl control="textarea" name="Address" placeholder="13 Street, Cairo" label="Address" required />
                <FormControl control="input" name="EmergyNumber" placeholder="+(20)1128880455" label="Emergency Number" required />
              </div>
            </div>

            {errorMsg && <p style={{ color: '#dc2626', margin: '8px 0' }}>{errorMsg}</p>}

            <div className="btns">
              <button type="button" className="btn" onClick={() => setShowModal(false)} disabled={mutation.isPending}>
                Cancel
              </button>
              <button type="submit" className="btn" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : isEdit ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default AddEmployee;