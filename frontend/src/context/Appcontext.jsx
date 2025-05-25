import React, { createContext, useEffect, useState } from "react";
import humanizeDuration from "humanize-duration";
import axios from "axios";
import { useAuth, useUser } from '@clerk/clerk-react';

export const appcontext = createContext();

const Appcontext = ({ children }) => {

  const currency = import.meta.env.VITE_CURRENCY;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [allcourses, setallcourses] = useState([]);
  const [iseducator, setiseducator] = useState(false);
  const [enrolledcourses,setenrolledcourses] = useState([])
  const [userdata,setuserdata] = useState(null)
  const {getToken} = useAuth()
  const {user} = useUser()

  const getallcourses = async () => {
    try {
        const {data} = await axios.get(`${backendUrl}/user/getallcourses`)
        if(data.success){
         setallcourses(data.allcourses);
        }else{
          console.log(data.message)
  
        }
    } catch (error) {
       console.log(error.message)
 
    }
  };

  const getuserdata = async () => {
    if(user.publicMetadata.role === 'educator'){
      setiseducator(true)
    }
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/user/getuserdata`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setuserdata(data.userData);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const calculaterating = (item) => {
    if (item.courseRatings.length === 0) {
      return 0;
    }
    let totalratings = 0;
    item.courseRatings.forEach((i) => {
      totalratings += i.rating;
    });

    return Math.floor(totalratings / item.courseRatings.length);
  };

  const calculatechaptertime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((item) => (time += item.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseduration = (course) => {
    let time = 0;
    course.courseContent.map((item) =>
      item.chapterContent.map((chapter) => (time += chapter.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculatelectureno = (course) => {
     let totallecture = 0;
      course.courseContent.forEach((item) => {
        if(Array.isArray(item.chapterContent)){
           totallecture += item.chapterContent.length
        }
      })
     return totallecture
  }

  const getenrolledcourses = async() => {
         try {
              const token = await getToken()
          const {data} = await axios.get(`${backendUrl}/user/user-enrollments`, {
               headers: { Authorization: `Bearer ${token}` },
          })
          if(data.success){
             setenrolledcourses(data.enrolledcourses.reverse())
          }else{
            console.log(data.message)
          }
         } catch (error) {
            console.log(error.message)
         }
  }

  useEffect(() => {
    getallcourses();
  }, []);

  useEffect(() => {
     if(user){
      getuserdata()
     }
  },[user])

  const datavalue = {
    currency,
    allcourses,
    calculaterating,
    iseducator,
    setiseducator,
    calculatechaptertime,
    calculateCourseduration, 
    calculatelectureno,
    getenrolledcourses,
    enrolledcourses,
    backendUrl,
    userdata,
    setuserdata,
    getToken,
    getallcourses,
  };

  return (
    <appcontext.Provider value={datavalue}>{children}</appcontext.Provider>
  );
};

export default Appcontext;
