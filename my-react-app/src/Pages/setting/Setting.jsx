import React from 'react'
import Pageheader from '../../Components/Pageheader'
import { IoSettingsOutline } from "react-icons/io5";
import './setting.css'
const Setting = () => {
  return (
    <div className="Dashboard-container">
        <Pageheader header={'Settings'} text={'Configure system preferences and options'}/>
        <div className="flex set">
            <div className="text-center">
                <div className="settingicon">
                    <IoSettingsOutline />
                </div>
                <h3 className="text-2xl font-bold mb-2">Settings Panel</h3>
                <p className="text-muted-foreground">Configure your system settings and preferences here.</p>
            </div>
        </div>
    </div>
  )
}

export default Setting