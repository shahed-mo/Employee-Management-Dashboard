import React from 'react'
import { FiDollarSign } from "react-icons/fi";

const PayrollCard = ({textH,money,moreText,icon,type}) => {
  return (
    <div className={`card ${type} fund`}>
        <div className="card-content">
            <div className="flex">
                <div>
                    <p className='texth'>{textH}</p>
                    <p className='money'>{money}</p>
                    <p className='moretext'>{moreText}</p>
                </div>
                <div className="icon">
                    {icon}
                </div>
            </div>
        </div>
    </div>
  )
}

export default PayrollCard