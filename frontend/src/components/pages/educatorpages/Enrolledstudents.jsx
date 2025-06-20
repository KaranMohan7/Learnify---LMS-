import React, { useContext, useEffect, useState } from "react";
import { appcontext } from "../../../context/Appcontext";
import axios from "axios";
import Loading from "../../student/Loading";
import { toast } from "react-toastify";

const Enrolledstudents = () => {
  const [enrolledStudents, setenrolledstudents] = useState([]);
  const { getToken, backendUrl, iseducator } = useContext(appcontext);
    const [loading, setloading] = useState(true);

  const fetchenrolledstudents = async () => {
    setloading(true)
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/educator/getenrolledstudentsdata`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setenrolledstudents(data.enrolledStudents.reverse());
        setloading(false)
      } else {
        toast.error(data.message);
        setloading(false)
      }
    } catch (error) {
      toast.error(error.message);
      setloading(false)
    }
  };

  useEffect(() => {
    if (iseducator) {
      fetchenrolledstudents();
    }
  }, [iseducator]);

  return (
    <div className="w-full h-screen p-5">
      <p className="font-semibold text-xl underline">All Enrolled Students</p>
      <div className="hidden sm:flex font-semibold bg-zinc-200 rounded-lg items-center justify-between px-2 py-2 mt-4">
        <p className="w-1/12">S No</p>
        <p className="w-4/12">Student Name</p>
        <p className="w-4/12">Course Title</p>
        <p className="w-3/12">Date</p>
      </div>
      {loading ? (
        <div className="w-full h-screen">
          <Loading />
        </div>
      ) : enrolledStudents.length > 0 ? (
        enrolledStudents.map((item, index) => (
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
                src={item?.student.imageurl}
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
              <p>{new Date(item.purchaseDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-11 text-gray-500">
          No enrollments available.
        </div>
      )}
    </div>
  );
};

export default Enrolledstudents;
