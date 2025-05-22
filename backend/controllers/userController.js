import courseModel from "../models/courseModel.js";
import progressModel from "../models/progressModel.js";
import purchaseModel from "../models/purchaseModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'


const getuserdata = async(req,res) => {
     try {
         const userId = req.auth.userId
         const userData = await userModel.findById(userId)
         if(!userData) return res.status(404).json({success: false, message: "User Not found"})
            res.status(200).json({success: true, userData})
     } catch (error) {
          res.status(400).json({ success: false, message: error.message });
     }
}

const getallcourses = async(req,res) => {
    try {
        const allcourses = await courseModel.find().select('-courseContent -enrolledStudents').populate({path: 'educator', select: "name"})
        if(!allcourses) return res.status(404).json({success: false, message: "Courses not found"})
        res.status(200).json({success: true, allcourses})
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const getcoursebyId = async(req,res) => { 
    try {
            const { id } = req.params;
            const particularcourse = await courseModel.findOne({_id: id}).populate({path: 'educator', select: "name"})
            if(!particularcourse) return res.status(404).json({success: false, message: "Course Not found"})
                particularcourse.courseContent.forEach(item => {
                  item.chapterContent.forEach(lecture => {
                    if(!lecture.isPreviewFree){
                        lecture.lectureUrl = ''
                    }
                  })
            })
             res.status(200).json({success: true, particularcourse})
    } catch (error) {
             res.status(400).json({ success: false, message: error.message });
    }
}
 
const userenrollments = async(req,res) => {
    try {
        const userId = req.auth.userId;
        const userEnrollments = await userModel.find({_id: userId}).populate('enrolledcourses').select("courseTitle courseContent courseThumbnail")
        if(!userEnrollments) return res.status(404).json({success: false, message: "Doesnt find enrollments"})
        res.status(200).json({success: true, enrolledcourses: userEnrollments.enrolledcourses})    
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const enrollcourse = async(req,res) => {
    try {

        const {id} = req.body
        const userId = req.auth.userId
        const { origin } = req.headers
        if(!userId) return res.status(404).json({success: false, message: "Login Please"})

        const userUpdate = await userModel.findOne({_id: userId}) 
        if(!userUpdate) return res.status(400).json({success: false, message: "Something went wrong cant Enroll"})      
        
        const courseUpdate = await courseModel.findOne({_id: id})
        if(!courseUpdate) return res.status(400).json({success: false, message: "Something went wrong cant Enroll"}) 

        const purchaseData = {
            courseId: courseUpdate._id,
            userId,
            amount: (courseUpdate.coursePrice - courseUpdate.discount * courseUpdate.coursePrice / 100).toFixed(2)
        } 
        
        const purchasedatabase = await purchaseModel.create(purchaseData)
        if(!purchasedatabase) return res.status(404).json({success: false, message: "Something went wrong with purchase data storing"})
        
        const stripeinstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = process.env.CURRENCY.toLowerCase()

        const lineitems = [
          {
            price_data: {
              currency,
              product_data: {
                name: courseUpdate.courseTitle,
              },
              unit_amount: Math.floor(purchaseData.amount) * 100,
            },
            quantity: 1,
          },
        ];

        const sessions = await stripeinstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: lineitems,
            mode: 'payment',
            metadata: {
                purchaseId: purchasedatabase._id.toString()
            }
        })

        res.status(200).json({success: true, session_url: sessions.url})              
    } catch (error) {
         res.status(400).json({ success: false, message: error.message });
    }
}

const updatecourseProgress = async(req,res) => {
    try {
         const userId = req.auth.userId;
         const {id, lectureId} = req.body
         const progress = await progressModel.findOne({userId, courseId:id})
         if(progress){
             if(progress.lectureCompleted.includes(lectureId)){
                return res.status(200).json({success: true, message: "Lecture already present"})
             }
             progress.lectureCompleted.push(lectureId)
             await progress.save()
         }else{
               await progressModel.create({
                userId,
                courseId: id,
                lectureCompleted : [lectureId]
            })
         }
         res.json({success: true, message: "Progress updated Successfully"})

    } catch (error) {
          res.status(400).json({ success: false, message: error.message });
    }
}

const getuserProgress = async(req,res) => {
    try {
          const userId = req.auth.userId;
         const {id} = req.body
         const progress = await progressModel.findOne({userId, courseId:id})
         if(!progress) return res.status(404).json({success: false, message: "progress not found"})
         res.status(200).json({success: true, progress})   
    } catch (error) {
         res.status(400).json({ success: false, message: error.message });
    }
}

const rateCourse = async(req,res) => {
    try {
         const userId = req.auth.userId;
         const {id, rating} = req.body
         if(!id || !userId || !rating || rating < 1 || rating > 5){
            return res.status(400).json({success: false, message: "Invalid Details"})
         }

         const course = await courseModel.findOne({_id: id})
         if(!course) return res.status(404).json({success: false, message: "Course Not found"})
         const user = await userModel.findOne({clerkId: userId})
         if(!user) return res.status(404).json({success: false, message: "user Not found"})

         if(!user.enrolledcourses.includes(id)){
            return res.status(404).json({success: false, message: "cant rate this course"})
         }   

         const existingRate = course.courseRatings.findIndex(c => c.userid === userId)
         if(existingRate > -1){
            course.courseRatings[existingRate].rating = rating
         }else{
            course.courseRatings.push({userid: userId, rating}) 
         }
         await course.save()
         res.status(200).json({success: true, message: "Ratings updated"})
      
    } catch (error) {
         res.status(400).json({ success: false, message: error.message });
    }
}

export { getallcourses, getcoursebyId, userenrollments, getuserdata, enrollcourse, updatecourseProgress, getuserProgress, rateCourse}