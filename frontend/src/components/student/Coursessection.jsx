import React, { useContext, useState } from 'react'
import Coursecard from '../student/Coursecard'
import { appcontext } from '../../context/Appcontext'
import { Link } from 'react-router-dom'
import Loading from '../../components/student/Loading'



const Coursessection = () => {
  
    const {allcourses} = useContext(appcontext)
 

  return (
    <div className='w-full flex flex-col justify-center items-center mt-5 md:mt-8 lg:mt-12'>
        <h1 className=' text-2xl md:text-3xl lg:text-4xl font-semibold'>Learn from the best</h1>
        <p className='text-zinc-400 py-2 text-center'>Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.</p>
        <div className='flex flex-wrap items-center justify-evenly mt-3 w-full gap-3'>
        {
            allcourses ?  allcourses.slice(0,4).map((item,index) => (
                <div key={index}>
                  <Coursecard item={item}/>
                </div>
            )) : <div className='h-1/2 w-1/2'><Loading /></div>
        }
        </div>
        <div>
            
        </div>
        <Link to={'/course-list'} className='bg-blue-50 border-[1px] border-blue-100 px-4 py-2 rounded-md mt-3 text-gray-500 font-semibold' >All Courses</Link> 
    </div>
  )
}

export default Coursessection