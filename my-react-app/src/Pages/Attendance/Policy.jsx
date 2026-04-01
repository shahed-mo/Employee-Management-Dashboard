import React from 'react'

const Policy = ({ par }) => {
  return (
    <div className="card">
        <div className="card-header">
            <h4>Policy</h4>
        </div>

        <div className="card-content">
            <div className="flex">
                <p>{par}</p>
            </div>
        </div>
    </div>
  )
}

export default Policy