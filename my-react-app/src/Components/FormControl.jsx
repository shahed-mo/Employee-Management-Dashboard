import React from 'react'
import {Formik,Form,Field} from 'formik'
import Input from './Input'
import  Radio  from './Radio'
import Select from './Select'
import Textarea from './Textarea'


const FormControl = ({control,...rest}) => {
    switch(control){
        case 'input':
            return <Input {...rest} />
        case 'radio':
            return <Radio {...rest} />
        case 'select':
            return <Select {...rest} />
        case 'textarea':
            return <Textarea {...rest} />
        default:
            return <></>
    }
}

export default FormControl