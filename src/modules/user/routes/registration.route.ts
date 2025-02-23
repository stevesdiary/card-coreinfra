import { Router } from 'express';

import { TypedRequest } from '../types/type';
import userRegistration from '../controllers/register.user';

const userRegistrationRouter = Router();

userRegistrationRouter.get('/health', (req: TypedRequest, res) => {
  res.status(200).json({ message: "Healthy!" });
});

userRegistrationRouter.post("/register", async (req: TypedRequest, res) => {
  await userRegistration.create(req, res);
});

userRegistrationRouter.post('/verify', async (req: TypedRequest, res) => {
  await userRegistration.verifyUser(req, res);
});

userRegistrationRouter.post('/resendcode', async (req: TypedRequest, res) => {
  await userRegistration.resendCode(req, res);
});

export default userRegistrationRouter;
