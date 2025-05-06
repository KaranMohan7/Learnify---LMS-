import React from 'react'
import { Outlet } from 'react-router-dom'
import Siderbar from '../../educator/Siderbar'

const Educator = () => {
  return (
    <div className='w-full flex '>
      <Siderbar />
      <div className='w-full'>
        {<Outlet />}
      </div>
    </div>
  )
}

export default Educator