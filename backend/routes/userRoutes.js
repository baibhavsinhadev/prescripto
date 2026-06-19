import { Router } from "express"
import { checkUserAuth, getUserProfileData, login, logout, register, updateUserProfile } from "../controllers/userController.js";
import { authUser } from "../middlewares/authUser.js";
import upload from "../configs/mutler.js";

const userRouter = new Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

userRouter.put("/update-profile", upload.single("image"), authUser, updateUserProfile);

userRouter.get("/check-user-auth", authUser, checkUserAuth);
userRouter.get("/profile", authUser, getUserProfileData);

export default userRouter;