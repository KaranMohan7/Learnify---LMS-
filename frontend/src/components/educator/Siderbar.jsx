import React from "react";
import { Link } from "react-router-dom";
import { MdHomeMax } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5"
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import { ImProfile } from "react-icons/im";

const Siderbar = () => {
  return (
    <div className="w-[20%] min-h-screen font-semibold flex flex-col items-start gap-12 py-10  border-r-[1px] border-zinc-500" >
      <Link to={'/educator'}>
        <div className="flex items-center gap-4 lg:gap-10  w-full px-5 md:px-2 lg:px-7">
          <MdHomeMax size={24} />
          <p className="text-sm hidden md:block lg:block lg:text-[16px] hover:text-green-600 transition-all duration-200">Dashboard</p>
        </div>
      </Link>
      <Link to={'add-course'} >
        <div className="flex items-center gap-4 lg:gap-10  w-full  px-5 md:px-2 lg:px-7">
        <IoAddCircleOutline size={24} />
        <p className="text-sm hidden md:block lg:block lg:text-[16px] hover:text-green-600 transition-all duration-200 ">Add Course</p>
        </div>
      </Link>
      <Link to={'my-courses'}>
        <div className="flex items-center  gap-4 lg:gap-10 w-full px-5 md:px-2 lg:px-7 ">
        <BsFillJournalBookmarkFill size={24} />
        <p className="text-sm  hidden md:block lg:block lg:text-[16px] hover:text-green-600 transition-all duration-200">My Courses</p>
        </div>
      </Link>
      <Link to={'enrolled-students'}>
        <div className="flex items-center  gap-4 lg:gap-10 w-full  px-5 md:px-2 lg:px-7 ">
        <ImProfile size={24} />
        <p className="text-sm hidden md:block lg:block lg:text-[16px] text-nowrap hover:text-green-600 transition-all duration-200" >Students Enrolled</p>
        </div>
      </Link>
    </div>
  );
};

export default Siderbar;
