import { v2 as cloudinary } from "cloudinary";
import validator from "validator";
import bcrypt from "bcrypt";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

// API for Admin Login : POST /api/admin/login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Required fields validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing Required Fields!"
            });
        }

        // Checking whether admin credentials are correct or not
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials!"
            });
        }

        // Creating token
        const token = jwt.sign(
            { email, role: "admin" },
            process.env.JWT_ADMIN_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login Successful"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API for admin logout : POST /api/admin/logout
export const adminLogout = async (req, res) => {
    try {
        res.clearCookie("adminToken");

        return res.status(200).json({
            success: true,
            message: "Logout Successful"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API for check admin auth : GET /api/admin/check-admin-auth
export const checkAdminAuth = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            admin: true
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            admin: false
        });
    }
};

// API for adding doctor : POST /api/admin/add
export const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // Required fields validation
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile) {
            return res.status(400).json({
                success: false,
                message: "Missing Required Fields!"
            });
        }

        // Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email Address!"
            });
        }

        // Password validation
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain uppercase, lowercase, number and special character."
            });
        }

        // Check whether doctor already exists or not
        const docExists = await Doctor.findOne({ email });
        if (docExists) {
            return res.status(400).json({
                success: false,
                message: "Doctor already exists"
            });
        };

        // Password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(
            imageFile.path,
            {
                folder: "doctors",
                resource_type: "image",
                format: "webp",
                transformation: [
                    {
                        quality: "auto",
                        fetch_format: "auto"
                    }
                ]
            }
        );

        const imageUrl = imageUpload.secure_url;

        // Delete local file after successful upload
        try {
            await fs.unlink(imageFile.path);
        } catch (err) {
            console.error(
                "Local file delete failed:",
                err.message
            );
        }

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address)
        };

        await Doctor.create(doctorData);

        return res.status(201).json({
            success: true,
            message: "Doctor added successfully"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API to get all doctors list : GET /api/admin/list
export const allDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select("-password").sort({ createdAt: -1 });
        if (doctors.length === 0) {
            return res.json({
                success: false,
                message: "No Doctor Found"
            });
        };

        res.status(200).json({
            success: true,
            doctors
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    };
};

// API to fetch all appointments : GET /api/admin/appointments
export const allAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            appointments
        })
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API to appointment cancellation : POST /api/admin/appointment/cancel
export const cancelAppointment = async (req, res) => {
    try {
        const role = req.admin.role;
        const { appointmentId } = req.body;

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        };

        // Verify ownership
        if (role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized action"
            });
        }

        if (appointment.cancelled) {
            return res.status(400).json({
                success: false,
                message: "Appointment already cancelled"
            });
        };

        // Mark appointment cancelled
        await Appointment.findByIdAndUpdate(appointmentId, {
            cancelled: true
        });

        // Release slot
        const { docId, slotDate, slotTime } = appointment;

        const doctor = await Doctor.findById(docId);
        let slots_booked = doctor.slots_booked;

        if (
            slots_booked[slotDate] &&
            slots_booked[slotDate].includes(slotTime)
        ) {
            slots_booked[slotDate] =
                slots_booked[slotDate].filter(
                    time => time !== slotTime
                );

            // Remove empty date key
            if (slots_booked[slotDate].length === 0) {
                delete slots_booked[slotDate];
            }

            await Doctor.findByIdAndUpdate(docId, {
                slots_booked
            });
        };

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API to fetch admin dashboard : GET /api/admin/dashboard
export const fetchAdminDashboard = async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        const users = await User.find({});
        const appointments = await Appointment.find({});

        const dashboardData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            recentAppointments: appointments.reverse().slice(0, 5)
        };

        res.status(200).json({
            success: true,
            dashboardData,
        })
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};