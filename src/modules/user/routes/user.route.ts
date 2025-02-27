import { Router, Request, Response, NextFunction } from 'express';
import userController from '../controllers/user.controller';
import authentication from '../../../middlewares/authentication';
import authorizeRole from '../../../middlewares/authorise';

const userRouter = Router();
userRouter.get('/', (req: Request, res: Response) => {
  res.json({
    Message: 'App is running'
  })
});

userRouter.put('/updateuser/:id', 
  authentication,
  authorizeRole(['user', 'admin']),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userController.updateUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get('/all', 
  authentication,
  authorizeRole(['admin', 'user']),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userController.getAllUsers(req, res);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get('/one/:id', 
  authentication,
  authorizeRole(['user', 'admin']),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userController.getOneUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.delete('/delete/:id', 
  authentication,
  authorizeRole(['admin']),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userController.deleteUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default userRouter;