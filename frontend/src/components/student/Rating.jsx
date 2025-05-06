import React, { useEffect, useState } from 'react'

const Rating = ({initialstate, onrate}) => {
 
    const [rating,setrating] = useState(initialstate || 0)

    const handlerating = (valuemain) => {
        setrating(valuemain)
        
        if(onrate){
            onrate(valuemain)
        }
    }

    useEffect(() => {
     if(initialstate){
        setrating(initialstate)
     }
    },[initialstate])

  return (
    <div className=''>
        {
            Array.from({length: 5}, (_, index) => {
                const value = index +1;
                return (
                    <span onClick={() => handlerating(value)} className={`text-2xl cursor-pointer transition-colors duration-300 mr-1 ${value <= rating ? 'text-yellow-500' : 'text-zinc-300'}`} key={index}>
                      &#9733;
                    </span>
                )
            })
        }
    </div>
  )
}

export default Rating