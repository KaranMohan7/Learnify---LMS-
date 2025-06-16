import React, { useContext, useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { FaPlay} from "react-icons/fa";
import { appcontext } from "../../../context/Appcontext";
import { useParams } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import ReactPlayer from "react-player";
import Loading from "../../student/Loading";
import Rating from "../../student/Rating";
import axios from "axios";
import { TiTick } from "react-icons/ti";
import { toast } from "react-toastify";

const Player = () => {
  const [playerEnrolledcourse, setplayerEnrolledcourse] = useState(null);
  const { enrolledcourses, calculatechaptertime, getenrolledcourses, getToken, backendUrl, userdata } = useContext(appcontext);
  const [activeindex, setactiveindex] = useState(null);
  const { courseId } = useParams();
  const [playerdata, setplayerdata] = useState(null);
  const [progressdata, setprogressdata] = useState(null)
  const [initialrating, setinitialrating] = useState(0)

  const fetchenrolledcourse = () => {

   enrolledcourses.map((item) => {
       if(item._id === courseId){
         setplayerEnrolledcourse(item)
         console.log(item)
         item.courseRatings.map((item) => {
           if(item.userid === userdata._id){
            setinitialrating(item.rating)
           }
         })
       }
    })

  };

  const updateProgress = async(lectureId) => {
    try {
      const token = await getToken()
      const {data} = await axios.post(`${backendUrl}/user/update-progress`, {id: courseId, lectureId} , {
           headers: { Authorization: `Bearer ${token}` },
      })
      if(data.success){
        getprogress()
         toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
        toast.error(error.message)
    }
  }

  const getprogress = async() => {
    try {
         const token = await getToken()
         const {data} = await axios.post(`${backendUrl}/user/get-progress`, {id: courseId}, {
              headers: { Authorization: `Bearer ${token}` },
         })
         if(data.success){
          setprogressdata(data.progress)
         }else{
           toast.error(data.message)
         }
    } catch (error) {
         toast.error(error.message)
    }
  }

  const updateRating = async(rating) => {
    try {
        const token = await getToken()
        const {data} = await axios.post(`${backendUrl}/user/add-ratings`, {id: courseId, rating}, {
                        headers: { Authorization: `Bearer ${token}` },
        })
        if(data.success){
          fetchenrolledcourse()
          toast.success(data.message)
        }else{
           toast.error(data.message)
        }
    } catch (error) {
       toast.error(error.message)
    }
  }

  useEffect(() => {
    if (enrolledcourses.length > 0) {
      fetchenrolledcourse();
    }
  }, [enrolledcourses]);

  useEffect(() => {
    getprogress()
  },[])

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
                            { progressdata && progressdata.lectureCompleted.includes(lec.lectureId) ? <TiTick size={20} />  : <FaPlay size={12} /> }
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
                                    lectureId: lec.lectureId
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
            <Rating initialstate={initialrating} onrate={updateRating}/>
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
       {
        playerdata && <div className="flex justify-between items-center px-1 py-2 ">
           <h1 className="font-semibold text-sm md:text-lg px-2 py-2 ">
              {playerdata && playerdata.chapter}.
              {playerdata && playerdata.lecture}{" "}
              {playerdata && playerdata.lectureTitle}
            </h1>
            <button onClick={() => updateProgress(playerdata.lectureId)} className="bg-blue-700 px-1 py-1 text-white font-semibold rounded-md text-sm">{progressdata && progressdata.lectureCompleted.includes(playerdata.lectureId) ? 'Completed' : 'Mark as complete'}</button>
          </div>
       }
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Player;
