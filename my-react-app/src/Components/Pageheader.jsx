import React from 'react'

const Pageheader = ({header,text}) => {
  return (
    <div className="header">
        <h2>{header}</h2>
        <p>{text}</p>
    </div>
  )
}

export default Pageheader