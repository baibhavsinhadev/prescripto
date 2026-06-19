import { Router } from "express";
import { allDoctors, cancelAppointment, checkDoctorAuth, doctorAppointments, doctorById, doctorDashboard, doctorLogin, doctorLogout, doctorProfile, getAvailableSlots, markAppointmentComplete, updatePassword, updateProfile } from "../controllers/doctorController.js"
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = new Router();

doctorRouter.post("/login", doctorLogin)
doctorRouter.post("/logout", doctorLogout)

doctorRouter.get('/list', allDoctors);
doctorRouter.get('/check-doctor-auth', authDoctor, checkDoctorAuth);
doctorRouter.get('/appointments', authDoctor, doctorAppointments);
doctorRouter.get('/profile', authDoctor, doctorProfile);
doctorRouter.get('/dashboard', authDoctor, doctorDashboard);
doctorRouter.get('/:docId', doctorById);
doctorRouter.get('/:docId/slots', getAvailableSlots);

doctorRouter.put('/mark-completed', authDoctor, markAppointmentComplete);
doctorRouter.put('/cancel', authDoctor, cancelAppointment);
doctorRouter.put('/update-profile', authDoctor, updateProfile);
doctorRouter.put('/update-password', authDoctor, updatePassword);

export default doctorRouter;