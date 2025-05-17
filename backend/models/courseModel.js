import mongoose from "mongoose";
import { chapterSchema } from "./chapterModel.js";

const courseSchema = new mongoose.Schema(
  {
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    coursePrice: { type: Number, required: true },
    ispublished: { type: Boolean, default: false },
    discount: { type: Number, required: true, min: 0, max: 100 },
    courseThumbnail: { type: String, default: "" },
    courseContent: [chapterSchema],
    courseRatings: [
      { userid: { type: String }, rating: { type: Number, min: 0, max: 5 } },
    ],
    educator: {
      type: String,
      ref: "user",
      required: true,
    },
    enrolledStudents: [
      { type: String, ref: "user" },
    ],
  },
  { timestamps: true, minimize: false }
);

const courseModel = mongoose.model("course", courseSchema);

export default courseModel;
