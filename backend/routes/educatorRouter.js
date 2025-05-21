import express from 'express';
import { addCourse, getcourses, getdashboardData, getenrolledstudentsdata, updateRoleeducator } from '../controllers/educatorController.js';
import { educatorAuthentication } from '../middlewares/authEducator.js';
import upload from '../middlewares/multer.js'

const educatorRouter = express.Router()

educatorRouter.get("/updaterole", updateRoleeducator)
educatorRouter.post("/add-course", upload.single("file"), addCourse)
educatorRouter.get("/get-courses",educatorAuthentication, getcourses)
educatorRouter.get("/getdashboardata",educatorAuthentication, getdashboardData)
educatorRouter.get("/getenrolledstudentsdata",educatorAuthentication,getenrolledstudentsdata)

export default educatorRouter