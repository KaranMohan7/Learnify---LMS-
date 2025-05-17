import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course", required: true },
    userId: { type: String, required: true },
    amount: {type: Number, required: true},
    status: { type: String, enum: ["completed","pending", "failed"], default: "pending" }

},{timestamps: true})

const purchaseModel = mongoose.model("purchase", purchaseSchema)
export default purchaseModel