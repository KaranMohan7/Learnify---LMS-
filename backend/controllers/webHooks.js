import { Webhook } from "svix";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import purchaseModel from "../models/purchaseModel.js";
import courseModel from "../models/courseModel.js";

const clerkwebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-signature": req.headers["svix-signature"],
      "svix-timestamp": req.headers["svix-timestamp"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        
        const userdata = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + "" + data.last_name,
          imageurl: data.image_url,
        };
        await userModel.create(userdata);
        res
          .status(200)
          .json({ success: true, message: "User Created Successfully" });
        break;
      }
      case "user.updated": {
        const userdata = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + "" + data.last_name,
          imageurl: data.image_url,
        };
        await userModel.findOneAndUpdate({ clerkId: data.id }, userdata);
        res
          .status(200)
          .json({ success: true, message: "User Updated Successfully" });
        break;
      }

      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        res
          .status(200)
          .json({ success: true, message: "User deleted Successfully" });
        break;
      }

      default:
        break;
    }
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};


const stripewebhook = async (request, response) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ensure it's defined here
    const sig = request.headers["stripe-signature"];
    const event = Stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const { purchaseId } = session.metadata;
        const purchase = await purchaseModel.findById(purchaseId);
        if (!purchase) return response.status(404).send("Purchase not found");

        purchase.status = "completed";
        await purchase.save();

        await userModel.findByIdAndUpdate(purchase.userId, {
          $push: { enrolledcourses: purchase.courseId },
        });

        await courseModel.findByIdAndUpdate(purchase.courseId, {
          $push: { enrolledStudents: purchase.userId },
        });

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentintentId = paymentIntent.id;
        const sessions = await stripe.checkout.sessions.list({
          payment_intent: paymentintentId,
        });
        const session = sessions.data[0];
        const { purchaseId } = session.metadata;
        const purchase = await purchaseModel.findById(purchaseId);
        if (purchase) {
          purchase.status = "failed";
          await purchase.save();
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    response.status(400).json({ success: false, message: error.message });
  }
};

export { clerkwebhooks, stripewebhook };
