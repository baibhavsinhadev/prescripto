import { Router } from "express";
import { authUser } from "../middlewares/authUser.js";
import { cancelAppointment, createAppointment, getUserAppointment } from "../controllers/appointmentController.js";

const appointmentRouter = new Router();

appointmentRouter.post("/create", authUser, createAppointment)
appointmentRouter.post("/cancel", authUser, cancelAppointment)
appointmentRouter.get("/user", authUser, getUserAppointment)

export default appointmentRouter