import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";

// API to create new appointment : POST /api/appointment/create
export const createAppointment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { docId, slotDate, slotTime } = req.body;

        const docData = await Doctor.findById(docId).select("-password");

        // Check whether doctor exists or not
        if (!docData) {
            return res.status(400).json({
                success: false,
                message: "Doctor Not Found"
            });
        };

        // Check whether doctor is available or not
        if (!docData.available) {
            return res.status(400).json({
                success: false,
                message: "Doctor is not available"
            });
        };

        let slots_booked = docData.slots_booked;

        // Checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.status(400).json({
                    success: false,
                    message: "Slot is already booked"
                });
            } else {
                slots_booked[slotDate].push(slotTime);
            };
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        };

        const userData = await User.findById(userId).select("-password");
        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate
        };

        const newAppointment = await Appointment.create(appointmentData);

        // Saves new slots data in docData
        await Doctor.findByIdAndUpdate(docId, {
            slots_booked
        });

        return res.status(200).json({
            success: true,
            message: "Appointment Booked Successfully"
        })
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API to fetch user appointments : GET /api/appointment/user
export const getUserAppointment = async (req, res) => {
    try {
        const userId = req.user.id;
        const appointments = await Appointment.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API to cancel appointment : POST /api/appointment/cancel
export const cancelAppointment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { appointmentId } = req.body;

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        };

        // Verify ownership
        if (appointment.userId !== userId) {
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