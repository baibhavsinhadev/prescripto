import mongoose, { Schema } from "mongoose"

const appointmentSchema = new Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ["Cash", "Razorpay", "Stripe"], default: "Cash" },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;