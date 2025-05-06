import React, { useState } from 'react'
import { assets } from '../../assets/assets/assets'
import { useNavigate } from 'react-router-dom'

const Searchpanel = ({data}) => {

  const navigate = useNavigate()
  const [search,setsearch] = useState(data ? data : "")

  const onsearchhandler = async(e) => {
      e.preventDefault()
      navigate("/course-list/" +search)
  }
   
  return (
    <form onSubmit={onsearchhandler} className="flex items-center justify-center py-5">
    <div className="relative w-[80%]">
      <img 
        src={assets.search_icon} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-70"
      />
      <input 
        type="text" 
        onChange={(e) => setsearch(e.target.value)}
        value={search}
        placeholder="Search for Courses"
        className="w-full pl-10 pr-24 py-3 border border-zinc-200 rounded-md outline-none"
      />
      <button 
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-semibold"
      >
        Search
      </button>
    </div>
  </form>
  
  )
}

export default Searchpanel