import React from 'react'
import { Field, ErrorMessage } from 'formik'
const Textarea = ({ label, name, required, ...rest }) => {
  return (
    <div className="form-control">
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <Field as="textarea" id={name} name={name} {...rest} />
      <ErrorMessage name={name} component="p" className="error" />
    </div>
  )
}

export default Textarea