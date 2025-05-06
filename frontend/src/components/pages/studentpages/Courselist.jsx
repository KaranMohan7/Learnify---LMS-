import React, { useContext, useEffect, useState } from 'react'
import Searchpanel from '../../student/Searchpanel'
import Coursecard from '../../student/Coursecard'
import { appcontext } from '../../../context/Appcontext'
import { useNavigate, useParams } from 'react-router-dom'
import { RxCross2 } from "react-icons/rx";

const Courselist = () => {
  
  const {allcourses} = useContext(appcontext)
  const {input} = useParams()
  const [filteredresult, setfilteredresult] = useState([])
  const navigate = useNavigate()


  const filtereddata = async() => {
     if(allcourses && allcourses.length > 0){
       const temp = allcourses.slice()
       input ? setfilteredresult(allcourses.filter((i) => i.courseTitle.toLowerCase().includes(input.toLowerCase()) ) ) : setfilteredresult(temp)
     }

  }

  useEffect(() => {
      filtereddata()
  }, [input,allcourses])
  

  return (
    <div className='w-full'>
       <div className='flex items-center justify-evenly py-11'>
        <div>
        <h1 className='text-2xl md:text-2xl lg:text-3xl font-semibold text-center'>All Courses</h1>
        </div>
        
        <div className='w-[70%]'>
        <Searchpanel data={input}  />
        </div>
       </div>

      {input && <div className='px-10 pb-4'><div className='px-3 py-2 font-semibold border-[1px] border-zinc-300 rounded-md inline-flex items-center gap-2 '>{input} <RxCross2 onClick={() => navigate("/course-list")} /></div></div>}
  
       <div className='flex flex-wrap items-center gap-3 md:gap-5 lg:gap-8 pb-10 justify-center'>
        {
          filteredresult && filteredresult.map((item,index) => (
               <Coursecard item={item} key={index} />
          ))
        }
       </div>

    </div>
  )
}

export default Courselist