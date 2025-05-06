import React from 'react'
import Hero from '../../student/Hero'
import Companies from '../../student/Companies'
import Coursessection from '../../student/Coursessection'
import Calltoaction from '../../student/Calltoaction'

const Home = () => {
  return (
    <div className='w-full flex flex-col items-center'>
      <Hero />
      <Companies />
      <Coursessection />
      <Calltoaction />
    </div>
  )
}

export default Home