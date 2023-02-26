import React from 'react'

const Alert = ({error}) => {
  return (
    <div style={alertStyle}>
      {error}
    </div>
  )
}

export default Alert

const alertStyle= {
  background: '#ffe7e6',
  color: '#f44336',
  padding : '5px 10px',
  borderRadius : '5px',
  marginBottom :'15px'
}