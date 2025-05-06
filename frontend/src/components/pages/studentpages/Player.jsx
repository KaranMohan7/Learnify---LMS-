import React, { useContext, useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { FaPlay, FaClock } from "react-icons/fa";
import { appcontext } from "../../../context/Appcontext";
import { useParams } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import ReactPlayer from "react-player";
import Loading from "../../student/Loading";
import Rating from "../../student/Rating";

const Player = () => {
  const [playerEnrolledcourse, setplayerEnrolledcourse] = useState(null);
  const { enrolledcourses, calculatechaptertime, getenrolledcourses } = useContext(appcontext);
  const [activeindex, setactiveindex] = useState(null);
  const { courseId } = useParams();
  const [playerdata, setplayerdata] = useState(null);

  const fetchenrolledcourse = () => {
    const maincourse = enrolledcourses.find((item) => item._id === courseId);
    setplayerEnrolledcourse(maincourse);
    console.log(maincourse);
  };

  useEffect(() => {
    fetchenrolledcourse();
  }, [enrolledcourses]);

   useEffect(() => {
    getenrolledcourses()
   },[])
  return playerEnrolledcourse ? (
    <div className="w-full flex flex-col-reverse lg:flex-row items-start px-4 md:px-10 py-2">
      <div className="py-5 w-full lg:w-1/2 mt-10">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-nowrap mb-3">
        Course Structure
      </h1>
        <div className="space-y-2">
          {playerEnrolledcourse &&
            playerEnrolledcourse.courseContent.map((item, index) => (
              <div
                key={index}
                className="px-4 border border-zinc-300 rounded-md py-3 bg-white"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setactiveindex(activeindex === index ? null : index)
                  }
                >
                  <div className="flex items-center gap-2">
                    {activeindex === index ? (
                      <MdKeyboardArrowUp />
                    ) : (
                      <MdKeyboardArrowDown />
                    )}
                    <p className="font-semibold text-sm sm:text-base">
                      {item.chapterTitle}
                    </p>
                  </div>
                  <p className="text-sm text-zinc-500">
                    {item.chapterContent.length} Lectures -{" "}
                    {calculatechaptertime(item)}
                  </p>
                </div>

                {activeindex === index && (
                  <ul className="flex flex-col px-2 py-2 space-y-2">
                    {item.chapterContent.map((lec, idx) => (
                      <li key={idx}>
                        <div className="flex justify-between items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2 text-sm">
                            <FaPlay size={12} />
                            <p className="font-semibold">{lec.lectureTitle}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-zinc-500">
                            {lec.lectureUrl && (
                              <p
                                onClick={() =>
                                  setplayerdata({
                                    lectureTitle: lec.lectureTitle,
                                    videoid: lec.lectureUrl.split("/").pop(),
                                    chapter: index + 1,
                                    lecture: idx + 1,
                                  })
                                }
                                className="text-blue-500 cursor-pointer"
                              >
                                WatchNow
                              </p>
                            )}
                            <p>
                              {humanizeDuration(
                                lec.lectureDuration * 60 * 1000,
                                {
                                  units: ["h", "m"],
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <h1 className="mt-5 font-semibold text-xl md:text-2xl">Rate our Course:</h1>
            <Rating initialstate={0}/>
        </div>
      </div>
      {/* Course card */}
      <div className="w-full lg:w-1/2  flex justify-center mt-7">
        <div className="bg-white border border-zinc-200 w-full sm:w-[80%] md:w-[70%] lg:w-[65%] rounded-md overflow-hidden shadow-sm ">
          {playerdata ? (
            <ReactPlayer
              controls={true}
              width={"100%"}
              url={`https://www.youtube.com/watch?v=${playerdata.videoid}`}
            />
          ) : (
            <img
              className="w-full h-auto"
              src={playerEnrolledcourse && playerEnrolledcourse.courseThumbnail}
              alt="Course Thumbnail"
            />
          )}
          <div className="flex justify-between items-center px-1 py-2 ">
           <h1 className="font-semibold text-sm md:text-lg px-2 py-2 ">
              {playerdata && playerdata.chapter}.
              {playerdata && playerdata.lecture}{" "}
              {playerdata && playerdata.lectureTitle}
            </h1>
            <button className="bg-blue-700 px-1 py-1 text-white font-semibold rounded-md text-sm">Mark as complete</button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Player;
