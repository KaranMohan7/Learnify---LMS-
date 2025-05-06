import React, { useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowUp } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";


const Addcourse = () => {
  const quillref = useRef(null);
  const editorref = useRef(null);

  const [coursetitle, setcoursetitle] = useState("");
  const [discount, setdiscount] = useState(0);
  const [courseprice, setcourseprice] = useState(0);
  const [chapters, setchapters] = useState([]);
  const [chapterid, setchapterid] = useState(null);
  const [chaptertitle, setchaptertitle] = useState("");
  const [image, setimage] = useState(null);

  const [lecturedetails, setlecturedetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  useEffect(() => {
    if (!quillref.current && editorref.current) {
      quillref.current = new Quill(editorref.current, {
        theme: "snow",
      });
    }
  }, []);

  const handleaddbutton = (e) => {
    e.preventDefault();
    if(chaptertitle.trim()){
      const newchapter = {
        chaptertitle,
        chapterid: uniqid(),
        open: false,
        chapterorder: chapters.length > 0 ? chapters.slice(-1)[0].chapterorder + 1 : 1,
        lectures: []
      };
      setchapters((prev) => [...prev, newchapter]);
    }
  };

  const togglechapter = (id) => {
    setchapters((prev) => prev.map((item) => item.chapterid === id ? {...item, open: !item.open } : item ))
  }

  const addlectures = (chapterid) => {
    if(lecturedetails.lectureDuration.trim() && lecturedetails.lectureTitle.trim() && lecturedetails.lectureUrl.trim()){
      const newlecture = {
        ...lecturedetails,
        id: uniqid()
      }
      setchapters((prev) => prev.map((item) => item.chapterid === chapterid ? {...item, lectures: [...item.lectures, newlecture] } : item))

      setlecturedetails({
        lectureTitle: "",
        lectureDuration: "",
        lectureUrl: "",
        isPreviewFree: false,
      });
    }
  }

  const deletechapters = (chapterid) => {
            setchapters((prev) => prev.filter((item) => (
              item.chapterid !== chapterid
            )))
  }

  const deletelectures = (id,chapterid) => {
      setchapters((prev) => prev.map((item) => (
              item.chapterid === chapterid ? { ...item, lectures: item.lectures.filter((lec) => lec.id !== id) } : item
      )))
  }  

  const handlesubmit  = async(e) => {
          e.preventDefault()
  }
 
  return (
    <div className="w-full min-h-screen p-5 ">
      <p className="font-semibold text-xl mb-4">Add A course</p>
      <form onSubmit={handlesubmit}>
        <div className="flex flex-col justify-center py-3 gap-4">
          <div>
            <p className="font-semibold text-zinc-500 ">Course Title</p>
            <input
              onChange={(e) => setcoursetitle(e.target.value)}
              value={coursetitle}
              className="w-full lg:w-1/2 px-2 py-2 border-[1px] border-zinc-300 outline-none"
              type="text"
              placeholder="Enter Your Course Title"
              required
            />
          </div>
          <div className="w-full lg:w-1/2">
            <p className="font-semibold text-zinc-500 ">Course Description</p>
            <div
              ref={editorref}
              className="w-full  h-32 px-3 py-4 border-[1px] border-zinc-300 "
              type="text"
              placeholder="Type here"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between w-1/2 gap-4">
            <div>
              <p className="font-semibold text-zinc-500">Course Price</p>
              <input
                required
                value={courseprice}
                onChange={(e) => setcourseprice(e.target.value)}
                min={0}
                className="px-2 border-[1px] border-zinc-300 outline-none rounded-md"
                type="number"
                placeholder=""
              />
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-zinc-500 text-nowrap">
                Course Thumbnail
              </p>
              <label
                htmlFor="thumbnailChange"
                className="flex items-center gap-3"
              >
                <FaFileUpload size={25} />
                <input
                  type="file"
                  id="thumbnailChange"
                  onChange={(e) => setimage(e.target.files[0])}
                  accept="image/*"
                  hidden
                />
                <img
                  className={`w-8 h-8 ${image ? "block" : "hidden"}`}
                  src={image ? URL.createObjectURL(image) : null}
                />
              </label>
            </div>
          </div>
          <div>
            <p className="font-semibold text-zinc-500">Discount (%)</p>
            <input
              value={discount}
              onChange={(e) => setdiscount(e.target.value)}
              type="number"
              min={0}
              max={100}
              className="px-2 py-1 border-[1px] border-zinc-300 outline-none rounded-md"
            />
          </div>

          {/* Adding lectures and mapping them */}
          <p className="font-semibold text-zinc-500">Add Chapters</p>
          <div className="w-full flex items-center gap-4">
            <input
              value={chaptertitle}
              onChange={(e) => setchaptertitle(e.target.value)}
              className="w-full lg:w-1/2 px-2 py-2 border-[1px] border-zinc-300 outline-none"
              type="text"
              placeholder="Enter The Chapter Name"
              required
            />
            <button
              onClick={handleaddbutton}
              className="px-2 py-2 bg-blue-700 text-white font-semibold rounded-md"
            >
              Add
            </button>
          </div>

          <div className="w-full flex flex-col justify-between gap-3">
            {chapters.map((item, index) => (
              <div
                className="w-full lg:w-1/2 h-full bg-zinc-100 flex flex-col justify-center px-3 py-2 border-[1px] border-zinc-300 outline-none"
                key={index}
              >
                <div className=" flex items-center justify-between">
                  <p className="text-zinc-500 font-semibold">
                   {index+1} {item.chaptertitle}
                  </p>
                  <div className="flex items-center gap-3">
                    {item.open ? (
                      <MdKeyboardArrowUp
                        onClick={() =>  togglechapter(item.chapterid)}
                        size={20}
                      />
                    ) : (
                      <IoIosArrowDown
                        onClick={() => togglechapter(item.chapterid)}
                        size={15}
                      />
                    )}
                    <RxCross2 onClick={() => deletechapters(item.chapterid)} size={15} />
                  </div>
                </div>
             {
              item.open ? <div className="flex flex-col">
              <p className="font-semibold text-sm">Add Lectures</p>
              <div className="py-2 space-y-3 text-sm">
                <input
                  value={lecturedetails.lectureTitle}
                  onChange={(e) =>
                    setlecturedetails({
                      ...lecturedetails,
                      lectureTitle: e.target.value,
                    })
                  }
                  className="w-2/3 px-2 py-1 border-[1px] border-zinc-300 outline-none rounded-md"
                  required
                  type="text"
                  placeholder="LectureTitle"
                />
                <input
                  value={lecturedetails.lectureDuration}
                  onChange={(e) =>
                    setlecturedetails({
                      ...lecturedetails,
                      lectureDuration: e.target.value,
                    })
                  }
                  className="w-2/3 px-2 py-1 border-[1px] border-zinc-300 outline-none rounded-md"
                  required
                  type="text"
                  placeholder="LectureDuration (ie. 10 minutes)"
                />
                <input
                  value={lecturedetails.lectureUrl}
                  onChange={(e) =>
                    setlecturedetails({
                      ...lecturedetails,
                      lectureUrl: e.target.value,
                    })
                  }
                  className="w-2/3 px-2 py-1 border-[1px] border-zinc-300 outline-none rounded-md"
                  required
                  type="text"
                  placeholder="LectureUrl"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={lecturedetails.isPreviewFree}
                    onChange={(e) =>
                      setlecturedetails({
                        ...lecturedetails,
                        isPreviewFree: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm text-zinc-600">
                    Is Preview Free?
                  </span>
                </label>
                <button onClick={() => addlectures(item.chapterid)} className="bg-blue-700 text-white font-semibold px-2 py-2 rounded-md">
                  Add Lecture
                </button>
                {
               item.lectures ? item.lectures.map((lecture,index) => (
                      <div className="flex flex-col justify-center border-[1px] border-zinc-400 rounded-md px-2 py-2" key={index}>
                        <div className="flex items-center justify-between "><p className="font-semibold">{index + 1} Lecture</p><MdDelete onClick={() => deletelectures(lecture.id,item.chapterid)} size={18} /></div>
                         <p className="font-semibold">Title - {lecture.lectureTitle}</p>
                         <p className="font-semibold">Duration -  {lecture.lectureDuration}</p>
                         <p className="text-blue-500 underline">LectureUrl - {lecture.lectureUrl}</p>
                         <p className={`text-green-500 ${!lecture.isPreviewFree && 'text-red-600' }`}>{lecture.isPreviewFree ? "Preview Free" : "Paid"}</p>
                      </div>
                )) : <p>No Lectures available !</p>
              }
              </div>
            </div> : null
             }
              </div>
            ))}
          </div>
          <button type="submit" className="bg-blue-800 text-white font-semibold px-2 py-2 rounded-md w-1/6">Submit Everything</button>
        </div>
      </form>
    </div>
  );
};

export default Addcourse;
