import React from 'react'
import { Field, ErrorMessage } from 'formik'

const Input = ({ label, name, required,icon, ...rest }) => {
  return (
    <div className='form-control'>
      
      {label && (
        <label htmlFor={name}>
          <span style={{marginRight:'3px'}}>{icon}</span>{label} {required && <span className="required">*</span>}
        </label>
      )}

      <Field
        id={name}
        name={name}
        {...rest}
        autoComplete={rest.autoComplete || "off"}
      />

      <ErrorMessage name={name} component="p" className="error" />

    </div>
  )
}

export default Input