import { NextFunction, Request, Response, Router } from 'express';


import cardProfileController from '../profile/controller/card-profile.controller';
import cardRequestController from '../Request/controller/card-request.controller';
import authentication from '../../../middlewares/authentication';
import authorizeRole from '../../../middlewares/authorise';

const cardRouter = Router();

cardRouter.post('/profile', 
  authentication, 
  authorizeRole(['admin', 'user']), 
  async (req: Request, res: Response, next: NextFunction) => {
    cardProfileController.createProfile
  }
);

cardRouter.get('/getall', 
  authentication, 
  authorizeRole(['admin']), 
  async (req: Request, res: Response, next: NextFunction) => {
    cardProfileController.getProfiles
  }
);

cardRouter.put('/update/:id', 
  authentication, 
  authorizeRole(['admin', 'user']), 
  async (req: Request, res: Response, next: NextFunction) => {
    cardProfileController.updateProfile
  }
);

cardRouter.post('/request', 
  authentication, 
  authorizeRole(['admin', 'user']), 
  async (req: Request, res: Response, next: NextFunction) => {
    cardRequestController.createRequest
  }
);



export default cardRouter;