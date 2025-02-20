import express, { Router } from "express";

import userRouter from "./modules/user/routes/user.route";
import loginRouter from "./modules/user/routes/login.route";
import registrationRouter from "./modules/user/routes/registration.route";

const router = Router();

router.use("/register", registrationRouter);
router.use("/user", userRouter);
router.use("/log", loginRouter);

export default router;
