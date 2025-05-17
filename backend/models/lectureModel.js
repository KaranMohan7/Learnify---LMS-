import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureId: { type: String, required: true },
    lectureOrder: { type: Number, required: true },
    lectureTitle: { type: String, required: true },
    lectureDuration: { type: String, required: true },
    lectureUrl: { type: String, required: true },
    isPreviewFree: { type: Boolean, default: false },
  },
  { _id: false }
);

export {lectureSchema}