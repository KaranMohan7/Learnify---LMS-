import React, { useContext, useEffect, useState } from "react";
import { IoMdPerson } from "react-icons/io";
import { IoBookSharp } from "react-icons/io5";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { appcontext } from "../../../context/Appcontext";
import axios from "axios";
import Loading from "../../student/Loading";
import Loader from "../../student/Loader";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { currency, iseducator, backendUrl, getToken } = useContext(appcontext);
  const [dashboarddata, setdashboarddata] = useState({});

  const fetchdashboarddata = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/educator/getdashboardata`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setdashboarddata(data.dashboardData);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if (iseducator) {
      fetchdashboarddata();
    }
  }, [iseducator]);

  return (
    <div className="w-full p-5 lg:p-7">
      <div className="flex flex-wrap justify-center gap-5">
       <div className="w-72 h-30 border-[1px] border-zinc-400 rounded-md flex items-center justify-center gap-3">
          <IoMdPerson size={30} />
          <div>
            <p className="lg:text-xl font-semibold">
              {dashboarddata?.totalenrolledstudents?.length || <Loader />}
            </p>
            <p>Total Enrollments</p>
          </div>
        </div>
      <div className="w-72 h-30 border-[1px] border-zinc-400 rounded-md flex items-center justify-center gap-3">
          <IoBookSharp size={30} />
          <div>
            <p className="lg:text-xl font-semibold">
              {dashboarddata.totalcourses || <Loader />}
            </p>
            <p>Total Courses</p>
          </div>
          </div>
         <div className="w-72 h-30 border-[1px] border-zinc-400 rounded-md flex items-center justify-center gap-3">
          <RiMoneyDollarCircleFill size={30} />
          <div>
            <p className="lg:text-xl font-semibold">
             { currency && dashboarddata.totalEarnings ? (
              <>
              {currency} {dashboarddata.totalEarnings}
              </>
              ) : <Loader /> 
            }
            </p>
            <p>Total Earnings</p>
          </div>
        </div>
      </div>

      {/* Latest Enrollments Section */}
      <p className="font-semibold text-xl mt-16 underline">Latest Enrollments</p>
      <div className="w-full py-3">

        {/* Table Header */}
        <div className="hidden sm:flex font-semibold bg-zinc-200 rounded-lg px-4 py-3">
          <p className="w-[10%]">S No</p>
          <p className="w-[45%]">Student Name</p>
          <p className="w-[45%]">Course Title</p>
        </div>

        {/* Data Rows */}
        {dashboarddata.totalenrolledstudents?.length > 0 ? (
          [...dashboarddata.totalenrolledstudents].reverse().map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center border-b border-zinc-300 px-4 py-4 bg-white gap-3"
            >
              {/* S No */}
              <div className="w-full sm:w-[10%]">
                <p className="font-semibold sm:hidden">S No:</p>
                <p>{index + 1}</p>
              </div>

              {/* Student */}
              <div className="w-full sm:w-[45%] flex items-center gap-2">
                <img
                  src={item?.item?.imageurl}
                  alt="student"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold sm:hidden">Student Name:</p>
                  <p className="truncate">{item?.item?.name}</p>
                </div>
              </div>

              {/* Course */}
              <div className="w-full sm:w-[45%]">
                <p className="font-semibold sm:hidden">Course Title:</p>
                <p className="truncate">{item?.courseTitle}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="pl-8 py-24"><Loading /></div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
