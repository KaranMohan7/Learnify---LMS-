import React from 'react'
import { assets } from "../../assets/assets/assets";
import Searchpanel from './Searchpanel';

const Hero = () => {
  return (
    <div className=' mt-10 md:mt-16 lg:mt-20 text-center'>
       <h1 className='text-2xl md:text-3xl lg:text-5xl font-semibold'>Empower your future with the<br/> courses designed to<span className='text-blue-800 font-bold'> fit your choice.</span><img className='place-self-end hidden md:block lg:block' src={assets.sketch} /></h1>
       <p className='text-zinc-400 py-4 text-sm md:text-[16px] lg:text-[16px]'>We bring together world-class instructors, interactive content, and a supportive community to help<br/> you achieve your personal and professional goals.</p>
       <Searchpanel />
    </div>
  )
}

export default Hero