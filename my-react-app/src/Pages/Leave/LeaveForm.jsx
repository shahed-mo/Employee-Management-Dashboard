import React from 'react';
import { Formik, Form } from 'formik';

const LeaveForm = ({ onClose, onSubmit }) => (
  <>
    <div className="modal-backdrop" onClick={onClose}></div>
    <div className="modal">
      <Formik
        initialValues={{ type: 'Annual', startDate: '', endDate: '', reason: '' }}
        onSubmit={async (values, { setSubmitting }) => {
          if (!values.startDate || !values.endDate) {
            alert('Please choose start and end dates');
          } else if (new Date(values.startDate) > new Date(values.endDate)) {
            alert('End date must be after start date');
          } else {
            try {
              await onSubmit(values);
              onClose();
            } catch (err) {
              console.error(err);
              alert('Could not submit the request');
            }
          }
          setSubmitting(false);
        }}
      >
        {({ handleChange, values, isSubmitting }) => (
          <Form className="leave-form">
            <label>Type:</label>
            <select name="type" value={values.type} onChange={handleChange}>
              <option value="Annual">Annual</option>
              <option value="Sick">Sick</option>
              <option value="Other">Other</option>
            </select>

            <label>Start Date:</label>
            <input type="date" name="startDate" value={values.startDate} onChange={handleChange} />

            <label>End Date:</label>
            <input type="date" name="endDate" value={values.endDate} onChange={handleChange} />

            <label>Reason:</label>
            <textarea name="reason" value={values.reason} onChange={handleChange} />

            <button type="submit" disabled={isSubmitting}>Submit Request</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </Form>
        )}
      </Formik>
    </div>
  </>
);

export default LeaveForm;