// PasswordField.jsx
import React, { useState } from 'react';
import FormControl from './FormControl';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const PasswordField = ({ value, onChange, name,autoComplete }) => {
  const [show, setShow] = useState(false);

  return (
    <div className='pass' style={{width:'100%'}}>
      <FormControl
        control="input"
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder="Password"
      />
      <p className='show'>{show ? 
        <VisibilityOffIcon className="eye" onClick={() => setShow(false)} /> :
        <RemoveRedEyeIcon className="eye" onClick={() => setShow(true)} />
      }</p>
    </div>
  );
};

export default PasswordField;