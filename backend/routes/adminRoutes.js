import { Router } from "express";
import { addDoctor, adminLogin, adminLogout, allAppointments, allDoctors, cancelAppointment, checkAdminAuth, fetchAdminDashboard } from "../controllers/adminController.js";
import { changeAvailability } from "../controllers/doctorController.js";
import upload from "../configs/mutler.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = new Router();

adminRouter.post("/add", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", adminLogin);
adminRouter.post("/logout", adminLogout);
adminRouter.post("/:docId", authAdmin, changeAvailability);
adminRouter.post("/appointment/cancel", authAdmin, cancelAppointment);

adminRouter.get('/check-admin-auth', authAdmin, checkAdminAuth);
adminRouter.get('/list', authAdmin, allDoctors);
adminRouter.get('/appointments', authAdmin, allAppointments);
adminRouter.get('/dashboard', authAdmin, fetchAdminDashboard);

export default adminRouter;