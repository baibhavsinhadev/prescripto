import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                authenticated: false,
                message: "Unauthorized Access"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_USER_SECRET
        );

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            authenticated: false,
            message: "Invalid or Expired Token"
        });
    }
};