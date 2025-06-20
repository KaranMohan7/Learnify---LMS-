import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets/assets";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import {
  useClerk,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { appcontext } from "../../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "./Loading";

const Navbar = () => {

  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { iseducator, backendUrl, setiseducator, getToken } = useContext(appcontext)
  const navigate = useNavigate()
  const [loading,setloading] = useState(false)


  const updateToeducator = async() => {
    setloading(true)
    if(iseducator){
        navigate("/educator")
        return;
    }
    try {
      const token = await getToken()
      const {data} = await axios.get(`${backendUrl}/educator/updaterole`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if(data.success){
        setiseducator(true)
        toast.success(data.message)
        setloading(false)
      }else{
        setiseducator(false)
        toast.error(data.message)
        setloading(false)
      }
    } catch (error) {
      toast.error(error.message)
        setloading(false)
    }
  }

  return (
    <div className="w-full py-3 md:py-4 lg:py-5 flex items-center justify-between px-1 md:px-6 lg:px-16 border-b-[1px] border-zinc-700">
      {
        loading && <div className="flex fixed justify-center items-center w-full h-screen bg-[rgba(0,0,0,0.2)] z-[100] top-0 left-0 ">
        <Loading />
      </div>
      }
      <Link to={'/'}>
        <img
          src={assets.logo}
          className="w-36 md:w-40 lg:w-40 "
        />
      </Link>
      <div className="font-semibold flex items-center gap-1 md:gap-3 lg:gap-4">
        <div className=" text-xs md:text-[16px] lg:text-[16px] cursor-pointer">
          {user && (
            <div className="flex items-center gap-0 md:gap-2 lg:gap-2 ">
              <p onClick={updateToeducator}>{iseducator ? 'Educator Dashboard |' : 'Become Educator |'}</p>
              <Link to={'/my-enrollments'}>My Enrollments</Link>
            </div>
          ) }
          {user ? null : (
            <button
              onClick={() => openSignIn()}
              className="block md:hidden lg:hidden"
            >
              <FaRegCircleUser size={30} />
            </button>
          )}
        </div>
        {user ? (
           <UserButton appearance={{
            elements: {
              userButtonAvatarBox: {
                width: "2.3rem",   
                height: "2.3rem",
              },
            },
          }}/>
        ) : (
            <button
            onClick={() => openSignIn()}
            className="bg-blue-800 text-white font-semibold px-4 py-2 rounded-md hidden md:block lg:block transition-all duration-300 hover:bg-blue-900"
          >
            Create Account
          </button> 
 )}
      </div>
    </div>
  );
};

export default Navbar;
