import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env");
        }

        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected");
        });

        mongoose.connection.on("error", (err) => {
            console.log({ err }, "MongoDB error");
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });

        await mongoose.connect(process.env.MONGODB_URI, {
            autoIndex: false,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            console.log("MongoDB connection closed (app termination)");
            process.exit(0);
        });

    } catch (error) {
        console.log("DB Connection Failed");
        process.exit(1);
    }
};

export default connectDB;