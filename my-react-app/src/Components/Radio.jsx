import React from 'react'
import {Field} from 'formik'
const Radio = ({label,name,options,...rest}) => {
  return (
   <>
   <label>{label}</label>
   {options.map((opt)=>{
    return <div key={opt.value}>
        <label htmlFor={opt.value}>{opt.label}</label>
        <Field id={opt.value} name={name} type="radio" value={opt.value} {...rest} />
    </div>
   })}
   </>
  )
}

export default Radio