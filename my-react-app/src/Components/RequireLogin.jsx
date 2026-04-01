import React from 'react'
import { Auth } from '../Context/Auth'
import { Navigate,useLocation } from 'react-router-dom';
const RequireLogin = ({children}) => {
  
    const auth = Auth();
    const location = useLocation();
    if(!auth.User){
        return <Navigate to="/auth" state={{path:location.pathname}} replace/> 
    }
  return (
    <div>{children}</div>
  )
}

export default RequireLogin