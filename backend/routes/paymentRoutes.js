import { Router } from "express";
import { authUser } from "../middlewares/authUser.js";
import { razorpayPayment, stripePayment, verifyRazorpay } from "../controllers/paymentController.js";

const paymentRouter = new Router();

paymentRouter.post("/razorpay", authUser, razorpayPayment);
paymentRouter.post("/verify-razorpay", authUser, verifyRazorpay);

paymentRouter.post("/stripe", authUser, stripePayment);

export default paymentRouter;