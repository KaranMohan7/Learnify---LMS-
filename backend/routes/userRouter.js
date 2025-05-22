import express from 'express'
import { enrollcourse, getallcourses, getcoursebyId, getuserdata, getuserProgress, rateCourse, updatecourseProgress, userenrollments } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get("/getuserdata",getuserdata)
userRouter.get("/getallcourses", getallcourses)
userRouter.get("/particularcourse/:id", getcoursebyId)
userRouter.get("/user-enrollments", userenrollments)
userRouter.post("/enroll-course", enrollcourse)
userRouter.post("/update-progress", updatecourseProgress)
userRouter.post("/get-progress",getuserProgress)
userRouter.post("/add-ratings", rateCourse)


export default userRouter