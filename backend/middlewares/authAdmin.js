import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.adminToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access!"
            });
        };

        const decoded = jwt.verify(
            token,
            process.env.JWT_ADMIN_SECRET
        );

        if (decoded.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Forbidden Access!"
            });
        };

        req.admin = decoded;
        next();
    } catch (error) {
        console.error(error);

        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token!"
        });
    }
};

export default authAdmin;