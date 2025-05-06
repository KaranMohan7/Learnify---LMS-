import React, { useContext, useEffect, useState } from "react";
import { appcontext } from "../../../context/Appcontext";

const Mycourses = () => {
  const { allcourses, currency } = useContext(appcontext);
  const [educatorcourses, seteducatorcourses] = useState([]);

  const fetchallcourses = async () => {
    seteducatorcourses(allcourses);
  };

  useEffect(() => {
    fetchallcourses();
  }, [allcourses]);

  return (
    <div className="w-full min-h-screen p-5 overflow-x-auto">
      <p className="font-semibold text-xl mb-4">My Courses</p>

      {/* Header row */}
      <div className="bg-zinc-200 hidden md:flex w-full px-4 py-2 font-semibold items-center rounded-md">
        <p className="w-1/2">All Courses</p>
        <p className="w-1/6">Earnings</p>
        <p className="w-1/6">Students</p>
        <p className="w-1/6">Published on</p>
      </div>

      {/* Course list */}
      {educatorcourses?.map((item, index) => (
        <div
          key={index}
          className="w-full px-2 py-3 bg-white rounded-md mt-3 flex flex-col md:flex-row md:items-center md:gap-2 shadow-sm"
        >
          {/* Course Info */}
          <div className="md:w-1/2 flex items-center gap-3 mb-2 md:mb-0">
            <img
              src={item?.courseThumbnail}
              alt="thumbnail"
              className="w-12 h-8 object-cover rounded"
            />
            <p className="text-sm lg:text-base font-medium truncate w-full">{item?.courseTitle}</p>
          </div>

          {/* Earnings */}
          <div className="md:w-1/6 mb-2 md:mb-0">
            <p className="md:hidden text-xs font-semibold text-gray-500">Earnings</p>
            <p className="text-sm lg:text-base">
              {currency}
              {Math.floor(
                item.enrolledStudents.length *
                (item.coursePrice - (item.discount * item.coursePrice) / 100)
              )}
            </p>
          </div>

          {/* Students */}
          <div className="md:w-1/6 mb-2 md:mb-0">
            <p className="md:hidden text-xs font-semibold text-gray-500">Students</p>
            <p className="text-sm lg:text-base">{item.enrolledStudents.length}</p>
          </div>

          {/* Published Date */}
          <div className="md:w-1/6">
            <p className="md:hidden text-xs font-semibold text-gray-500">Published on</p>
            <p className="text-sm lg:text-base">{new Date(item.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Mycourses;
