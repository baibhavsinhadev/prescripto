import { v2 as cloudinary } from "cloudinary";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// API to register user : POST /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Required fields validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing Required Fields"
            });
        };

        // Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email Address!"
            });
        };

        // Password validation
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain uppercase, lowercase, number and special character."
            });
        };

        // Checking whether user exists or not
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(500).json({
                success: false,
                message: "User already exists"
            });
        };

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Saving the user data in database
        const userData = {
            name,
            email,
            password: hashedPassword
        };
        const newUser = await User.create(userData);

        // Generating the token
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_USER_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Account created successfully"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    };
};

// API to login user : POST /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Required fields validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing Required Fields"
            });
        }

        // Check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_USER_SECRET,
            { expiresIn: "7d" }
        );

        // Send cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
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
    };
};


// API to logout user : POST /api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token");

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
    };
};

// API to check user authentication : GET /api/user/check-auth
export const checkUserAuth = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            authenticated: true
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API to get user profile data : GET /api/user/profile
export const getUserProfileData = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check whether use exists or not
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        };

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// API to update user profile : PUT /api/user/profile
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, gender, dob, address } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !gender || !dob || !address) {
            return res.status(400).json({
                success: false,
                message: "Missing Required Fields"
            });
        };

        await User.findByIdAndUpdate(userId, {
            name,
            phone,
            gender,
            dob,
            address: JSON.parse(address)
        });

        if (imageFile) {
            // upload image to cloudinary
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

            const imageURL = imageUpload.secure_url;

            // Delete local file after successful upload
            try {
                await fs.unlink(imageFile.path);
            } catch (err) {
                console.error(
                    "Local file delete failed:",
                    err.message
                );
            }

            await User.findByIdAndUpdate(userId, { image: imageURL })
        };

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};