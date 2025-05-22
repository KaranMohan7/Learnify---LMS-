import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
     _id: {type: String, required: true},
     name: {type: String, required: true},
     email: {type: String, required: true},
     imageurl: {type: String, rquired: true},
     enrolledcourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "course"
        }
     ]
}, {timestamps: true})

const userModel = mongoose.model("user", userSchema)

export default userModel
