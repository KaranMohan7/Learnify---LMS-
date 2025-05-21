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

const stripeinstance = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripewebhook = async (request, response) => {
  try {

    let event;
     const sig = request.headers["stripe-signature"];
     event = Stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const paymentintentId = paymentIntent.id;
        const session = await stripeinstance.checkout.session.list({
          payment_intent: paymentintentId,
        });
        const { purchaseId } = session.data[0].metadata;
        const purchasedata = await purchaseModel.findById(purchaseId);
        const userdatamain = await userModel.findOneAndUpdate(
          { clerkId: purchasedata.userId },
          { $push: { enrolledcourses: purchasedata.courseId.toString() } },
          { new: true }
        );
        const coursedatamain = await courseModel.findOneAndUpdate(
          { _id: purchasedata.courseId },
          { $push: { enrolledStudents: purchasedata.userId } },
          { new: true }
        );
        purchasedata.status = "completed";
        await purchasedata.save();
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentintentId = paymentIntent.id;
        const session = await stripeinstance.checkout.session.list({
          payment_intent: paymentintentId,
        });
        const { purchaseId } = session.data[0].metadata;
        const purchasedata = await purchaseModel.findById(purchaseId);
        purchasedata.status = "failed";
        await purchasedata.save();
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export { clerkwebhooks, stripewebhook };
