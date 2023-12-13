import React from 'react'

const InfoBox = ({  children }) => {
  return (
    <div className='text-center font-semibold bg-green-100 p-2 rounded-xl border border-green-300'>{children}</div>
  )
}

export default InfoBox