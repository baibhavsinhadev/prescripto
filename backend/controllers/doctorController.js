import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";

// API for doctor login: POST /api/doctor/login
export const doctorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Required fields validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing Required Fields!"
            });
        };

        // Checking doctor exists or not
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(400).json({
                success: false,
                message: "Doctor Not Found"
            });
        };

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        };

        // Creating token
        const token = jwt.sign(
            { id: doctor.id },
            process.env.JWT_DOCTOR_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("doctorToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
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

// API for doctor logout : POST /api/doctor/logout
export const doctorLogout = async (req, res) => {
    try {
        res.clearCookie("doctorToken");

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

// API for check doctor auth : GET /api/doctor/check-doctor-auth
export const checkDoctorAuth = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            doctor: true
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// API to change availability : POST /api/admin/:docId & POST /api/doctor/:docId
export const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.params;

        // Check whether doctor existis or not
        const docData = await Doctor.findById(docId);
        if (!docData) {
            return res.status(400).json({
                success: false,
                message: "Doctor doesn't exists"
            });
        };

        // Change availability of Doctor
        await Doctor.findByIdAndUpdate(docId, {
            available: !docData.available
        });

        res.status(200).json({
            success: true,
            message: `${docData.name} is now ${docData.available ? "Unavailable" : "Available"}`
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// API to fetch all doctors : POST /api/doctor
export const allDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select(["-password", "-email"]).sort({ createdAt: -1 });
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

// API to fetch doctor by id : GET /api/doctor/:docId
export const doctorById = async (req, res) => {
    try {
        const { docId } = req.params;
        const doctor = await Doctor.findById(docId).select("-password -email");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        res.status(200).json({
            success: true,
            doctor
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API to get available slots : GET /api/doctor/:docId/slots
export const getAvailableSlots = async (req, res) => {
    try {
        const { docId } = req.params;

        const doctor = await Doctor.findById(docId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        };

        const slots = [];
        const today = new Date();

        for (let i = 0; i < 10; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            const slotDate = currentDate.getDate() + "_" + (currentDate.getMonth() + 1) + "_" + currentDate.getFullYear();

            let startTime = new Date(currentDate);
            let endTime = new Date(currentDate);

            endTime.setHours(21, 0, 0, 0);

            if (i === 0) {
                startTime.setHours(
                    startTime.getHours() > 10
                        ? startTime.getHours() + 1
                        : 10
                );

                startTime.setMinutes(
                    startTime.getMinutes() > 30 ? 30 : 0
                );
            } else {
                startTime.setHours(10, 0, 0, 0);
            };

            const daySlots = [];

            while (startTime < endTime) {
                const formattedTime = startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                });

                const isBooked = doctor.slots_booked?.[slotDate]?.includes(formattedTime);
                if (!isBooked) {
                    daySlots.push({
                        datetime: new Date(startTime),
                        time: formattedTime
                    });
                };

                startTime.setMinutes(
                    startTime.getMinutes() + 30
                );
            };

            if (daySlots.length > 0) {
                slots.push({
                    date: slotDate,
                    day: currentDate.getDay(),
                    dayNumber: currentDate.getDate(),
                    slots: daySlots
                });
            };
        };

        return res.status(200).json({
            success: true,
            slots
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    };
};

// API to get doctor appointments : GET /api/doctor/appointments
export const doctorAppointments = async (req, res) => {
    try {
        const docId = req.doctor.id;
        const appointments = await Appointment.find({ docId });

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
    };
};

// API to mark appointment completed : PUT /api/doctor/mark-completed
export const markAppointmentComplete = async (req, res) => {
    try {
        const docId = req.doctor.id;
        const { appointmentId } = req.body;

        const appointmentData = await Appointment.findById(appointmentId);
        if (appointmentData && appointmentData.docId === docId) {
            await Appointment.findByIdAndUpdate(appointmentId, {
                isCompleted: true
            });

            return res.status(200).json({
                success: true,
                message: "Marked as completed"
            });
        } else {
            return res.status(400).json({
                success: true,
                message: "Appointment Not Found"
            });
        };
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API to cancel appointment : PUT /api/doctor/cancel
export const cancelAppointment = async (req, res) => {
    try {
        const docId = req.doctor.id;
        const { appointmentId } = req.body;

        const appointmentData = await Appointment.findById(appointmentId);
        if (appointmentData && appointmentData.docId === docId) {
            await Appointment.findByIdAndUpdate(appointmentId, {
                cancelled: true
            });

            return res.status(200).json({
                success: true,
                message: "Appointment Cancelled"
            });
        } else {
            return res.status(400).json({
                success: true,
                message: "Appointment Not Found"
            });
        };
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API to fetch dashboard data : GET /api/doctor/dashboard
export const doctorDashboard = async (req, res) => {
    try {
        const docId = req.doctor.id;
        const appointments = await Appointment.find({ docId });

        let earnings = 0;
        appointments.map((appointment) => {
            if (appointment.isCompleted || appointment.payment) {
                earnings += appointment.amount;
            };
        });

        let patients = [];
        appointments.map((appointment) => {
            if (!patients.includes(appointment.userId)) {
                patients.push(appointment.userId);
            };
        });

        const dashboardData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            recentAppointments: appointments.reverse().slice(0, 5)
        };

        res.status(200).json({
            success: true,
            dashboardData
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API to get doctor profile : GET /api/doctor/profile
export const doctorProfile = async (req, res) => {
    try {
        const docId = req.doctor.id;

        const profileData = await Doctor.findById(docId).select("-password");
        if (!profileData) {
            return res.status(400).json({
                success: false,
                message: "Doctor Not Found"
            });
        };

        res.status(200).json({
            success: true,
            profileData
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API to update doctor profile : PUT /api/doctor/update-profile
export const updateProfile = async (req, res) => {
    try {
        const docId = req.doctor.id;

        const { fees, address, available } = req.body;
        await Doctor.findByIdAndUpdate(docId, {
            fees,
            address,
            available
        });

        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API to update doctor password : PUT /api/doctor/update-password
export const updatePassword = async (req, res) => {
    try {
        const docId = req.doctor.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        };

        const doctor = await Doctor.findById(docId);

        const isMatch = await bcrypt.compare(currentPassword, doctor.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        };

        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain uppercase, lowercase, number and special character."
            });
        };

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await Doctor.findByIdAndUpdate(docId, {
            password: hashedPassword
        });

        res.clearCookie("doctorToken");

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};