import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import courseModel from "../models/courseModel.js";
import purchaseModel from "../models/purchaseModel.js";
import userModel from "../models/userModel.js";

const updateRoleeducator = async (req, res) => {
  try {
    const userId = req.auth.userId;
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });
    res.status(200).json({ success: true, message: "You are a educator now" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const addCourse = async (req, res) => {
  try {
    const educatorId = req.auth.userId;
    const { courseData } = req.body;
    if (!courseData) {
      return res
        .status(400)
        .json({ success: false, message: "courseData not provided" });
    }
    const image = req.file;
    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not Present" });
    }

    const parseddata = JSON.parse(courseData);

    if (!parseddata)
      return res
        .status(404)
        .json({ success: false, message: "Doest got the data" });

    parseddata.educator = educatorId;

    const newcourse = await courseModel.create(parseddata);

    if (!newcourse)
      return res.status(400).json({
        success: false,
        message: "Something went wrong with the Data",
      });

    const imageupload = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });

    newcourse.courseThumbnail = imageupload.secure_url;
    await newcourse.save();
    res
      .status(200)
      .json({ success: true, message: "Course Successfully added" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getcourses = async (req, res) => {
  try {
    const EducatorId = req.auth.userId;
    const allcourses = await courseModel.find({ educator: EducatorId });
    if (!allcourses)
      return res
        .status(404)
        .json({ success: false, message: "Courses Not found" });
    res.status(200).json({ success: true, allcourses });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getdashboardData = async (req, res) => {
  try {
    const EducatorId = req.auth.userId;
    const allcourses = await courseModel.find({ educator: EducatorId });

    if (!allcourses)
      return res
        .status(404)
        .json({ success: false, message: "Courses Not found" });

    const totalcourses = allcourses.length;
    const totalids = allcourses.map((item) => item._id);
    const purchases = await purchaseModel.find({
      courseId: { $in: totalids },
      status: "completed",
    });
    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );
    const totalenrolledstudents = [];

    for (const course of allcourses) {
      const students = await userModel.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageurl"
      );

      students.forEach((item) => {
        totalenrolledstudents.push({
          courseTitle: course.courseTitle,
          item,
        });
      });
    }
    const dashboardData = {
      totalEarnings,
      totalenrolledstudents,
      totalcourses,
    };
    res.status(200).json({ success: true, dashboardData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getenrolledstudentsdata = async (req, res) => {
  try {
    const EducatorId = req.auth.userId;

    const allcourses = await courseModel.find({ educator: EducatorId });

    if (!allcourses)
      return res
        .status(404)
        .json({ success: false, message: "Courses Not found" });
    
     const totalids = allcourses.map((item) => item._id); 
         const purchases = await purchaseModel.find({
          courseId: { $in: totalids },
         status: "completed",
    }).populate("userId", "name imageurl").populate("courseId","courseTitle");

    const enrolledStudents = purchases.map(item=>  ({
      student: item.userId,
      courseTitle: item.courseId.courseTitle,
      purchaseDate: item.createdAt
    }))
    
    res.status(200).json({success: true, enrolledStudents})

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export {
  updateRoleeducator,
  addCourse,
  getcourses,
  getdashboardData,
  getenrolledstudentsdata,
};
