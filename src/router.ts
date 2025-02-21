import express, { Router } from "express";

import userRouter from "./modules/user/routes/user.route";
import loginRouter from "./modules/user/routes/login.route";
import registrationRouter from "./modules/user/routes/registration.route";
import cardRouter from "./modules/card/routes/card.route";
const router = Router();

router.use("/register", registrationRouter);
router.use("/user", userRouter);
router.use("/log", loginRouter);
router.use("/card", cardRouter);

export default router;
