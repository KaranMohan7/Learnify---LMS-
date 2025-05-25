import React from 'react'
import { assets } from '../../assets/assets/assets'
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  
  return (
    <div className='w-full py-5 flex items-center justify-between  px-5 lg:px-11 border-b-[1px] border-zinc-00'>
         <img
                src={assets.logo}
                className="w-36 md:w-40 lg:w-40 "
              />
              <div className='flex items-center gap-3'>
                <p className='font-semibold text-black text-lg'>Hi Karan !</p>
                <CgProfile size={30} />
              </div>
    </div>
  )
}

export default Navbar