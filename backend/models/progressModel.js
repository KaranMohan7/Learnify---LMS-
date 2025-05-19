import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    courseId: {type: String, required: true},
    completed: {type: Boolean, default: false},
    lectureCompleted: []
}, {minimize: false})

const progressModel = mongoose.model("progress", progressSchema)
export default progressModel