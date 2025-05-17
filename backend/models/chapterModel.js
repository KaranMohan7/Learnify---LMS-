import mongoose from "mongoose";
import { lectureSchema } from "./lectureModel.js";

const chapterSchema = new mongoose.Schema(
  {
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    open: { type: Boolean, default: false },
    chapterTitle: { type: String, required: true },
    chapterContent: [lectureSchema],
  },
  { _id: false }
);

export {chapterSchema}