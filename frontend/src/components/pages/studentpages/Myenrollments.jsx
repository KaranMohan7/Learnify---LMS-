import React, { useContext, useEffect, useState } from "react";
import { appcontext } from "../../../context/Appcontext";
import { useNavigate } from "react-router-dom";
import { Line } from "rc-progress";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import Loading from '../../../components/student/Loading'

const Myenrollments = () => {
  const {
    getenrolledcourses,
    enrolledcourses,
    calculateCourseduration,
    getToken,
    backendUrl,
    calculatelectureno,
  } = useContext(appcontext);
  const [progressarray, setprogressarray] = useState([]);

  const navigate = useNavigate();
  const { user } = useUser();

  const getcourseprogress = async () => {
    try {
      const token = await getToken();
      const tempprogress = await Promise.all(
        enrolledcourses.map(async (course, index) => {
          const { data } = await axios.post(
            `${backendUrl}/user/get-progress`,
            { id: course._id },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          let totallectures = calculatelectureno(course);
          const lecturecompleted = data.progress
            ? data.progress.lectureCompleted.length
            : 0;

          return { totallectures, lecturecompleted };
        })
      );
      setprogressarray(tempprogress);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getenrolledcourses();
    }
  }, [user]);
 
  useEffect(() => {
    if(enrolledcourses.length > 0){
        getcourseprogress();
    }
  },[enrolledcourses])

  return (
    <div className="w-full px-4 md:px-8 py-6 ">
      <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl mb-5">
        My Enrollments
      </h1>

      {/* Header Row */}
      <div className="hidden md:flex items-center justify-between font-semibold bg-gray-100 rounded-lg px-4 py-3 mb-4 ">
        <p className="w-1/3">Course</p>
        <div className="flex items-center justify-between w-2/3">
          <p className="w-1/3 text-center">Duration</p>
          <p className="w-1/3 text-center">Completed</p>
          <p className="w-1/3 text-center">Status</p>
        </div>
      </div>

      {/* Course Cards */}
      <div className="flex flex-col gap-5">
        {enrolledcourses.length > 0 ? (
          enrolledcourses.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 bg-white shadow-sm rounded-lg p-4"
            >
              {/* Course Info */}
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <img
                  src={item.courseThumbnail}
                  alt="course thumbnail"
                  className="w-28 h-16 object-cover rounded"
                />
                <div className=" w-full ">
                  <p className="font-semibold text-sm md:text-base">
                    {item.courseTitle}
                  </p>
                  <Line
                    strokeWidth={1.5}
                    percent={
                      progressarray[index]
                        ? (progressarray[index].lecturecompleted * 100) /
                          progressarray[index].totallectures
                        : 0
                    }
                    className="bg-blue-400 rounded-full mt-2"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col md:flex-row md:items-center justify-between w-full md:w-2/3 gap-2 md:gap-0 text-sm md:text-base">
                <p className="text-center w-full md:w-1/3">
                  {calculateCourseduration(item)}
                </p>
                <p className="text-center w-full md:w-1/3">
                  {progressarray[index] &&
                    `${progressarray[index].lecturecompleted} / ${progressarray[index].totallectures}`}{" "}
                  Lectures
                </p>
                <div className="flex justify-center w-full md:w-1/3">
                  <button
                    onClick={() => navigate(`/player/${item._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 transition text-white rounded px-3 py-2 font-bold"
                  >
                    {progressarray[index] &&
                      `${
                        progressarray[index].lecturecompleted ===
                        progressarray[index].totallectures
                          ? "Completed"
                          : "On Going"
                      }`}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Myenrollments;
