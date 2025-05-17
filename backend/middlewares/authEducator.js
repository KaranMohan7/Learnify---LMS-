import { clerkClient } from "@clerk/express";

const educatorAuthentication = async (req,res,next) => {
    try {
        const userid = req.auth.userId
        if(!userid) return res.status(404).json({success: false, message: "User not logged in"})
        const responseeducator = await clerkClient.users.getUser(userid)
        if(responseeducator.publicMetadata.role !== 'educator'){
            return res.status(401).json({ message: "Unauthorized" });
        }
        next()
    } catch (error) {
         res.status(400).json({success: false, message: error.message})
    }
}

export {educatorAuthentication}