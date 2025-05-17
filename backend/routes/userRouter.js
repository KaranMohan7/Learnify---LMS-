import express from 'express'
import { enrollcourse, getallcourses, getcoursebyId, userenrollments } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get("/getallcourses", getallcourses)
userRouter.get("/particularcourse/:id", getcoursebyId)
userRouter.get("/user-enrollments", userenrollments)
userRouter.post("/enroll-course", enrollcourse)


export default userRouter