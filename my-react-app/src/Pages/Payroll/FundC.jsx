import React from 'react'

const FundC = ({header,icon,s1,s2,s3,s4,type}) => {
  return (
    <div className={`card ${type} fund`}>
        <div className="card-header">
            <h4 className="card-title"><span className="icon" style={{background:'none'}}>{icon}</span>{header}</h4>
        </div>
        <div className="card-content">
            <div className="flex f">
                <span className='s1'>{s1}</span>
                <span className='s2'>{s2}</span>
            </div>
            <div className="flex f">
                <span className='s1'>{s3}</span>
                <span className='s2'>{s4}</span>
            </div>
        </div>
    </div>
  )
}

export default FundC