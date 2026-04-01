import React from 'react'
import { Field, ErrorMessage } from 'formik'
const Select = ({ label, name, options, required, ...rest }) => {
  return (
    <div className="form-control">
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      <Field as="select" id={name} name={name} {...rest}>
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Field>

      <ErrorMessage name={name} component="p" className="error" />
    </div>
  )
}
export default Select