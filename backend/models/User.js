import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "https://i.postimg.cc/m25PxrWt/profile-pic.png" },
    address: {
        type: Object,
        default: {
            line1: "",
            line2: ""
        }
    },
    gender: { type: String, default: "Not Selected" },
    dob: { type: String, default: "Not Selected" },
    phone: { type: String, default: "+91 00000 00000" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;