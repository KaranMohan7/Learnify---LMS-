import React, { createContext, useEffect, useState } from "react";
import { assets, dummyCourses } from "../assets/assets/assets";
import humanizeDuration from "humanize-duration";

export const appcontext = createContext();

const Appcontext = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [allcourses, setallcourses] = useState([]);
  const [iseducator, setiseducator] = useState(false);
  const [enrolledcourses,setenrolledcourses] = useState([])

  const getallcourses = async () => {
    setallcourses(dummyCourses);
  };

  const calculaterating = (item) => {
    if (item.courseRatings.length === 0) {
      return 0;
    }
    let totalratings = 0;
    item.courseRatings.forEach((i) => {
      totalratings += i.rating;
    });

    return totalratings / item.courseRatings.length;
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
    setenrolledcourses(dummyCourses)
  }

  useEffect(() => {
    getallcourses();
  }, []);

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
    enrolledcourses
    
  };

  return (
    <appcontext.Provider value={datavalue}>{children}</appcontext.Provider>
  );
};

export default Appcontext;
