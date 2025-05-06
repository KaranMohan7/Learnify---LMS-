import { Webhook } from "svix";
import userModel from "../models/userModel.js";

const clerkwebhooks = async(req,res) => {
    try { 
           const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

           await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-signature": req.headers["svix-signature"],
            "svix-timestamp": req.headers["svix-timestamp"],
           })

           const {data,type} = req.body;

           switch(type){
            case 'user.created': {
                const userdata = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + "" + data.last_name,
                    imageurl: data.image_url
                }
                await userModel.create(userdata)
                res.status(200).json({success: true, message: "User Created Successfully"})
                break;
            }
            case "user.updated": {
                const userdata = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + "" + data.last_name,
                    imageurl: data.image_url
                }
                await userModel.findOneAndUpdate({ clerkId: data.id }, userdata)
                res.status(200).json({success: true, message: "User Updated Successfully"})
                break;
            }

            case "user.deleted": {
               await userModel.findOneAndDelete({ clerkId: data.id });
               res.status(200).json({success: true, message: "User deleted Successfully"})
               break;
            }

           }

    } catch (error) {
        res.status(401).json({success: false, message: error.message})
    }
}

export { clerkwebhooks }