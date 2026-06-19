import jwt from "jsonwebtoken";

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        const token = req.cookies.doctorToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access!"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_DOCTOR_SECRET
        );

        req.doctor = decoded;
        next();
    } catch (error) {
        console.error(error);

        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token!"
        });
    }
};

export default authDoctor;