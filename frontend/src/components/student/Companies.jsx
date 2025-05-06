import React from 'react'
import { assets } from '../../assets/assets/assets'

const Companies = () => {
 
  const imagedata = [
    assets.microsoft_logo,
    assets.walmart_logo,
    assets.accenture_logo,
    assets.adobe_logo,
    assets.paypal_logo
  ]
  
  return (
    <div className='w-full flex flex-col items-center py-10'>
       <p className='text-zinc-400 font-semibold'>Trusted by learners from</p>
         <div className='flex flex-wrap items-center justify-center gap-8 md:gap-14 lg:gap-20 mt-10 '>
          {
            imagedata.map((item,index) => (
              <div className='' key={index}>
                 <img src={item} className='w-26' />
              </div>
             
            ))
          }
         </div>
    </div> 
  )
}

export default Companies