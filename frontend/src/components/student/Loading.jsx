import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
    
   const {path} = useParams()
   const navigate = useNavigate()

   useEffect(() => {
      if(path){
        const timer = setTimeout(() => {
          navigate(`/${path}`)
        },5000)
        return () => clearTimeout(timer)
      }
   },[])

  return (
    <div class="flex-col gap-4 w-full flex items-center justify-center h-full">
      <div class="w-30 h-30 border-4 border-transparent text-blue-700 text-4xl animate-spin flex items-center justify-center border-t-blue-700 rounded-full">
        <div class="w-26 h-26 border-4 border-transparent text-zinc-400 text-2xl animate-spin flex items-center justify-center border-t-zinc-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default Loading;
