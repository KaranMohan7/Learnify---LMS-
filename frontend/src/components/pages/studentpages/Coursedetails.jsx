import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { appcontext } from "../../../context/Appcontext";
import Loading from "../../student/Loading";
import { assets } from "../../../assets/assets/assets";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { FaPlay, FaClock } from "react-icons/fa";
import humanizeDuration from "humanize-duration";
import { LuClock11 } from "react-icons/lu";
import { HiMiniBookOpen } from "react-icons/hi2";
import ReactPlayer from 'react-player';
import axios from "axios";
import { toast } from "react-toastify";

const Coursedetails = () => {
  const { id } = useParams();
  const [coursedetails, setcoursedetails] = useState(null);
  const [activeindex, setactiveindex] = useState(null);
  const [isalreadyenrolled, setisalreadyenrolled] = useState(false)
  const [playerdata,setplayerdata] = useState(null)
  const [loading,setloading] = useState(false)

  const {
    allcourses,
    calculaterating,
    calculatechaptertime,
    currency,
    calculateCourseduration,
    calculatelectureno,
    backendUrl,
    userdata,
    getToken
  } = useContext(appcontext);

  const fetchcoursedetails = async () => {
      try {
          const {data} = await axios.get(`${backendUrl}/user/particularcourse/${id}`)
          if(data.success){
             setcoursedetails(data.particularcourse);
          }else{
            toast.error(data.message)
          }
      } catch (error) {
        toast.error(error.message)
      }
  };

  const enrollcourse = async() => {
    setloading(true)
    try {
      if(!userdata){
        return toast.warn("Login to enroll!")
      }
      if(isalreadyenrolled){
        return toast.warn("Already Enrolled")
      }
      const token = await getToken()
      const {data} = await axios.post(`${backendUrl}/user/enroll-course`, {id: coursedetails._id} , {
           headers: { Authorization: `Bearer ${token}` },
      })
      if(data.success){
        const {session_url} = data;
        window.location.replace(session_url)
        setloading(false)
        toast.success("Enrolled Successfully")
      }else{
        toast.error(data.message)
         setloading(false)
      }
    } catch (error) {
       toast.error(error.message)
       setloading(false)
    }
  }

  useEffect(() => {
    fetchcoursedetails();
  }, [allcourses]);

  useEffect(() => {
    if(userdata && coursedetails){
      setisalreadyenrolled(userdata.enrolledcourses.includes(coursedetails._id))

    }
  }, [userdata, coursedetails])
  

  if (!coursedetails) return <div className="w-full h-screen flex items-center justify-center "><Loading /></div>;

  return (
    <div className="w-full flex flex-col-reverse lg:flex-row items-start px-4 sm:px-8 md:px-14 gap-6">
       {
        loading && <div className="flex fixed justify-center items-center w-full h-screen bg-[rgba(0,0,0,0.2)] z-[100] top-0 left-0 ">
        <Loading />
      </div>
      }
      {/* Left Column */}
      <div className="w-full lg:w-1/2 mt-5">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mt-3 pb-2">
          {coursedetails.courseTitle}
        </h1>

        <p
          className="text-zinc-400 text-sm md:text-base"
          dangerouslySetInnerHTML={{
            __html: coursedetails.courseDescription.slice(0, 400),
          }}
        ></p>

        {/* Ratings */}
        <div className="flex flex-wrap items-center gap-2 py-3">
          <p className="font-semibold">{calculaterating(coursedetails)}</p>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculaterating(coursedetails))
                    ? assets.star
                    : assets.star_blank
                }
                alt="star"
                className="w-4 h-4"
              />
            ))}
          </div>
          <p className="text-zinc-500 text-sm">
            ({coursedetails.courseRatings.length}{" "}
            {coursedetails.courseRatings.length > 1 ? "Ratings" : "Rating"})
          </p>
          <p className="text-blue-500 text-sm">
            ({coursedetails.enrolledStudents.length}{" "}
            {coursedetails.enrolledStudents.length > 1
              ? "Students"
              : "Student"})
          </p>
        </div>

        <p>
          Course by{" "}
          <span className="font-bold underline">{coursedetails.educator.name}</span>
        </p>

        {/* Course Structure */}
        <div className="py-7">
          <p className="font-semibold text-xl md:text-2xl mb-2">Course Structure</p>
          <div className="space-y-2">
            {coursedetails.courseContent.map((item, index) => (
              <div
                key={index}
                className="px-4 border border-zinc-300 rounded-md py-3 bg-white"
              >
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setactiveindex(activeindex === index ? null : index)}>
                  <div className="flex items-center gap-2">
                    {activeindex === index ? (
                      <MdKeyboardArrowUp />
                    ) : (
                      <MdKeyboardArrowDown />
                    )}
                    <p className="font-semibold text-sm sm:text-base">{item.chapterTitle}</p>
                  </div>
                  <p className="text-sm text-zinc-500">
                    {item.chapterContent.length} Lectures -{" "}
                    {calculatechaptertime(item)}
                  </p>
                </div>

                {activeindex === index && (
                  <ul className="flex flex-col px-6 py-2 space-y-2">
                    {item.chapterContent.map((lec, idx) => (
                      <li key={idx}>
                        <div className="flex justify-between items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2 text-sm">
                            <FaPlay size={12} />
                            <p className="font-semibold">{lec.lectureTitle}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-zinc-500">
                            {lec.isPreviewFree && (
                              <span onClick={() => setplayerdata({
                                videoid: lec.lectureUrl.split("/").pop()
                              })} className="text-blue-500 cursor-pointer">
                                Preview
                              </span>
                            )}
                            <p>
                              {humanizeDuration(lec.lectureDuration * 60 * 1000, {
                                units: ["h", "m"],
                              })}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Full description below structure */}
            <p
              className="custom-text mt-8 text-sm text-zinc-500"
              dangerouslySetInnerHTML={{
                __html: coursedetails.courseDescription,
              }}
            ></p>
          </div>
        </div>
      </div>

      {/* Right Column (Course card) */}
      <div className="w-full lg:w-1/2  flex justify-center mt-7">
        <div className="bg-white border border-zinc-200 w-full sm:w-[80%] md:w-[70%] lg:w-[65%] rounded-md overflow-hidden shadow-sm ">
          { playerdata ?  <ReactPlayer url={`https://www.youtube.com/watch?v=${playerdata.videoid}` } controls={true} width={'100%'} /> : <img className="w-full h-auto" src={coursedetails.courseThumbnail} alt="Course Thumbnail" /> }
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <FaClock color="red" />
              <p className="text-red-400 font-semibold text-sm">
                5 days left at this price!
              </p>
            </div>
            <div className="flex items-center gap-3">
            <p className="text-2xl font-bold">
              {currency} {(coursedetails.coursePrice - coursedetails.discount * coursedetails.coursePrice / 100).toFixed(2)}
            </p>
            <p className="text-zinc-400 line-through ">{currency} {coursedetails.coursePrice}</p>
            <p className="font-semibold">{coursedetails.discount}% off</p>
            </div>

            <div className="flex items-center ">
                    <div className="flex items-center gap-2 text-nowrap">
                      <img src={assets.star}  />
                       <p>{calculaterating(coursedetails)} </p>
                       <p className="flex items-center gap-2 text-sm md:text-[16px] lg:text-[16px]"> | <LuClock11 />{calculateCourseduration(coursedetails)} </p>
                       <p className="flex items-center gap-2 text-sm md:text-[16px] lg:text-[16px]"> |<HiMiniBookOpen />{calculatelectureno(coursedetails)} Lessons</p>
                    </div>
            </div>
            <div className="flex justify-center pt-4">
            <button onClick={enrollcourse} className="text-white font-semibold bg-blue-700 w-full px-2 py-2 rounded-md">{isalreadyenrolled ? 'Already Enrolled' : 'Enroll Now !'}</button>
            </div>
            <div className="py-5 px-3 ">
              <p className="font-semibold text-lg">Whats is in the course ?</p>
              <ul className="text-zinc-500 list-disc">
                 <li>Lifetime access with free updates.</li>
                 <li>Step-by-step, hands-on project guidance.</li>
                 <li>Downloadable resources and source code.</li>
                 <li>Quizzes to test your knowledge.</li>
                 <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coursedetails;