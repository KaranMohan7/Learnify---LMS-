import React, { useContext, useEffect, useState } from "react";
import { IoMdPerson } from "react-icons/io";
import { IoBookSharp } from "react-icons/io5";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { appcontext } from "../../../context/Appcontext";
import { dummyDashboardData } from "../../../assets/assets/assets";

const Dashboard = () => {
  const { currency } = useContext(appcontext);
  const [dashboarddata, setdashboarddata] = useState({});

  const fetchdashboarddata = () => {
    setdashboarddata(dummyDashboardData);
  };

  useEffect(() => {
    fetchdashboarddata();
  }, []);

  return (
    <div className="w-full p-5 lg:p-8">
      <div className="flex flex-wrap items-center justify-center gap-5 ">
        <div className="w-72 h-30 border-[1px] border-zinc-400 rounded-md flex items-center justify-center gap-3">
          <IoMdPerson size={30} />
          <div>
            <p className="lg:text-xl font-semibold">
              {dashboarddata?.enrolledStudentsData?.length}
            </p>
            <p>Total Enrollments</p>
          </div>
        </div>
        <div className="w-72 h-30 border-[1px] border-zinc-400 rounded-md flex items-center justify-center gap-3">
          <IoBookSharp size={30} />
          <div>
            <p className="lg:text-xl font-semibold">
              {dashboarddata.totalCourses}
            </p>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="w-72 h-30 border-[1px] border-zinc-400 rounded-md flex items-center justify-center gap-3">
          <RiMoneyDollarCircleFill size={30} />
          <div>
            <p className="lg:text-xl font-semibold">
             {currency} {dashboarddata.totalEarnings}
            </p>
            <p>Total Earnings</p>
          </div>
        </div>
      </div>

      <p className="font-semibold text-xl mt-16">Latest Enrollments</p>
      <div className="w-full py-3">
  {/* Header */}
  <div className="hidden sm:flex font-semibold bg-zinc-200 rounded-lg items-center justify-between px-2 py-2">
    <p className="w-1/12">S No</p>
    <p className="w-4/12">Student Name</p>
    <p className="w-4/12">Course Title</p>
    <p className="w-3/12">Date</p>
  </div>

  {/* Data Rows */}
  {dashboarddata.enrolledStudentsData ? (
    dashboarddata.enrolledStudentsData
      .slice()
      .reverse()
      .map((item, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row bg-white border-b border-zinc-300   px-4 py-4 gap-2 sm:gap-0"
        >
          {/* S No */}
          <div className="sm:w-1/12">
            <p className="font-semibold sm:hidden">S No:</p>
            <p>{index + 1}</p>
          </div>

          {/* Student */}
          <div className="sm:w-4/12 flex items-center gap-2">
            <img
              src={item?.student.imageUrl}
              alt="student"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold sm:hidden">Student Name:</p>
              <p className="truncate">{item?.student.name}</p>
            </div>
          </div>

          {/* Course */}
          <div className="sm:w-4/12">
            <p className="font-semibold sm:hidden">Course Title:</p>
            <p className="truncate">{item.courseTitle}</p>
          </div>

          {/* Date */}
          <div className="sm:w-3/12">
            <p className="font-semibold sm:hidden">Date:</p>
            <p>24 July 2022</p>
          </div>
        </div>
      ))
  ) : (
    <p className="font-semibold mt-3">Not Available</p>
  )}
</div>
    </div>
  );
};

export default Dashboard;
