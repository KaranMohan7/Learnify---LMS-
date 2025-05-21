import React, { useEffect, useRef, useState, useContext } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowUp } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { appcontext } from "../../../context/Appcontext";
import axios from "axios";

const Addcourse = () => {
  const quillref = useRef(null);
  const editorref = useRef(null);

  const [coursetitle, setcoursetitle] = useState("");
  const [discount, setdiscount] = useState(0);
  const [courseprice, setcourseprice] = useState(0);
  const [chapters, setchapters] = useState([]);
  const [chapterTitle, setchapterTitle] = useState("");
  const [image, setimage] = useState(null);

  const [lecturedetails, setlecturedetails] = useState({
    lectureTitle: "",
    lectureDuration: 0,
    lectureUrl: "",
    isPreviewFree: false,
  });
  const { backendUrl } = useContext(appcontext);

  useEffect(() => {
    if (!quillref.current && editorref.current) {
      quillref.current = new Quill(editorref.current, {
        theme: "snow",
      });
    }
  }, []);

  const handleaddbutton = (e) => {
    e.preventDefault();
    if (chapterTitle.trim()) {
      const newchapter = {
        chapterTitle,
        chapterId: uniqid(),
        open: false,
        chapterOrder:
          chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        chapterContent: [],
      };
      setchapters((prev) => [...prev, newchapter]);
    }
  };

  const togglechapter = (id) => {
    setchapters((prev) =>
      prev.map((item) =>
        item.chapterId === id ? { ...item, open: !item.open } : item
      )
    );
  };

  const addlectures = (chapterid) => {
    if (
      lecturedetails.lectureDuration.trim() &&
      lecturedetails.lectureTitle.trim() &&
      lecturedetails.lectureUrl.trim()
    ) {
      const newlecture = {
        ...lecturedetails,
        lectureId: uniqid(),
         lectureOrder:
          chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
      };
      setchapters((prev) =>
        prev.map((item) =>
          item.chapterId === chapterid
            ? { ...item, chapterContent: [...item.chapterContent, newlecture] }
            : item
        )
      );

      setlecturedetails({
        lectureTitle: "",
        lectureDuration: 0,
        lectureUrl: "",
        isPreviewFree: false,
      });
    }
  };

  const deletechapters = (chapterid) => {
    setchapters((prev) => prev.filter((item) => item.chapterId !== chapterid));
  };

  const deletelectures = (id, chapterid) => {
    setchapters((prev) =>
      prev.map((item) =>
        item.chapterId === chapterid
          ? { ...item, chapterContent: item.lectures.filter((lec) => lec.lectureId !== id) }
          : item
      )
    );
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      return console.log("image upload plz");
    }

    const courseData = {
      courseTitle: coursetitle,
      courseDescription: quillref.current?.root.innerHTML,
      coursePrice: courseprice,
      discount: discount,
      courseContent: chapters,
    };
    console.log(courseData)
    const formData = new FormData();
    formData.append("courseData", JSON.stringify(courseData));
    formData.append("file", image);

    try {
      const {data} = await axios.post(
        `${backendUrl}/educator/add-course`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        console.log("hello love");
        setchapterTitle("")
        setcourseprice("")
        setcoursetitle("")
        setdiscount("")
        setlecturedetails({
              lectureTitle: "",
              lectureDuration: "",
              lectureUrl: "",
              isPreviewFree: false,
        })
        setchapters([])
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
              value={chapterTitle}
              onChange={(e) => setchapterTitle(e.target.value)}
              className="w-full lg:w-1/2 px-2 py-2 border-[1px] border-zinc-300 outline-none"
              type="text"
              placeholder="Enter The Chapter Name"
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
                    {index + 1} {item.chapterTitle}
                  </p>
                  <div className="flex items-center gap-3">
                    {item.open ? (
                      <MdKeyboardArrowUp
                        onClick={() => togglechapter(item.chapterId)}
                        size={20}
                      />
                    ) : (
                      <IoIosArrowDown
                        onClick={() => togglechapter(item.chapterId)}
                        size={15}
                      />
                    )}
                    <RxCross2
                      onClick={() => deletechapters(item.chapterId)}
                      size={15}
                    />
                  </div>
                </div>
                {item.open ? (
                  <div className="flex flex-col">
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
                      <button
                        onClick={() => addlectures(item.chapterId)}
                        className="bg-blue-700 text-white font-semibold px-2 py-2 rounded-md"
                      >
                        Add Lecture
                      </button>
                      {item.chapterContent ? (
                        item.chapterContent.map((lecture, index) => (
                          <div
                            className="flex flex-col justify-center border-[1px] border-zinc-400 rounded-md px-2 py-2"
                            key={index}
                          >
                            <div className="flex items-center justify-between ">
                              <p className="font-semibold">
                                {index + 1} Lecture
                              </p>
                              <MdDelete
                                onClick={() =>
                                  deletelectures(lecture.lectureId, item.chapterId)
                                }
                                size={18}
                              />
                            </div>
                            <p className="font-semibold">
                              Title - {lecture.lectureTitle}
                            </p>
                            <p className="font-semibold">
                              Duration - {lecture.lectureDuration}
                            </p>
                            <p className="text-blue-500 underline">
                              LectureUrl - {lecture.lectureUrl}
                            </p>
                            <p
                              className={`text-green-500 ${
                                !lecture.isPreviewFree && "text-red-600"
                              }`}
                            >
                              {lecture.isPreviewFree ? "Preview Free" : "Paid"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>No Lectures available !</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="bg-blue-800 text-white font-semibold px-2 py-2 rounded-md w-1/2 lg:w-1/5 text-sm lg:text-[15px]"
          >
            Submit Everything
          </button>
        </div>
      </form>
    </div>
  );
};

export default Addcourse;
