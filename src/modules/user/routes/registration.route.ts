import { Router, Request, Response } from 'express';
import { TypedRequest } from '../types/type';
import userRegistration from '../controllers/register.user';


const userRegistrationRouter = Router();

userRegistrationRouter.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ message: "Healthy!"})
})
userRegistrationRouter.post("/register",  async (req: TypedRequest, res: Response) => {
  await userRegistration.create(req, res);
});

userRegistrationRouter.post('/verify', async (req: Request, res: Response) => {
  await userRegistration.verifyUser(req, res);
});

export default userRegistrationRouter;
