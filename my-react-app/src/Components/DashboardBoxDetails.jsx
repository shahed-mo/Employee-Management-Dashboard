import React from 'react'

const DashboardBoxDetails = ({title,icon,number,CardText,present}) => {
  return (
    <div className='CardDetails'>
        <div className="card_header pt-6 ">
            <h4 className='card_titile'>{title}</h4>
            <div className="icon">
                {icon}
            </div>
        </div>
        <div className="card_content pt-6 ">
            <div className="num">{number}</div>
            <p>{CardText}</p>
            <div className="more-employee">
                <span className='present'>{present}</span>
                <span>vs last month</span>
            </div>
        </div>
    </div>
  )
}

export default DashboardBoxDetails