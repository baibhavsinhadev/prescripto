import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import cookieParser from "cookie-parser";

import { stripeWebhooks } from "./controllers/paymentController.js";

import limiter from "./middlewares/limiter.js";

import connectDB from "./configs/mongoDB.js";
import connectCloudinary from "./configs/cloudinary.js";

import adminRouter from "./routes/adminRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import userRouter from "./routes/userRoutes.js";
import appointmentRouter from "./routes/appointmentRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* Security Headers */
app.use(helmet());

/* Stripe Webhooks */
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks)

/* Body Parser */
app.use(express.json({ limit: "10kb" }));

/* Prevent HTTP Parameter Pollution */
app.use(hpp());

/* Compression */
app.use(compression());

/* Cookie Parser */
app.use(cookieParser());

/* Rate Limiting */
app.use("/api", limiter);

/* CORS */
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        };
    },
    credentials: true,
}));

// Database & External Configuration
await connectDB();
await connectCloudinary();

/* Hide Express Signature */
app.disable("x-powered-by");

/* Routes */
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is live"
    });
});

app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/payment", paymentRouter);

/* 404 Handler */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

/* Global Error Handler */
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});