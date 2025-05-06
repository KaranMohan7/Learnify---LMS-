import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRouter.js'
import { clerkwebhooks } from './controllers/webHooks.js';


const app = express();
const PORT = process.env.PORT || 4000
 await connectDB();
connectCloudinary()


const allowedOrigins = [
    process.env.FRONTEND_URL_USER, 
    'http://localhost:5173',
    'http://localhost:5174'
  ];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }))

  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))

  app.use("/user", userRouter)
  app.post("/clerk", clerkwebhooks)


app.listen(PORT, () => {
    console.log("server started successfully")
})
