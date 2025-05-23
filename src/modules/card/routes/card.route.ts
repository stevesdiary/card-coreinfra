import { NextFunction, Request, Response, Router } from 'express';


import cardProfileController from '../card-profile/controller/card-profile.cotroller';
import cardRequestController from '../Request/controller/card-request.controller';
import authentication from '../../../middlewares/authentication';
import authorizeRole from '../../../middlewares/authorise';

const cardRouter = Router();

cardRouter.post('/profile', 
  authentication, 
  authorizeRole(['admin', 'user']), 
  async (req: Request, res: Response, next: NextFunction) => {
    cardProfileController.createProfile(req, res);
  }
);

cardRouter.get('/getall', 
  authentication, 
  authorizeRole(['admin', 'user']), 
  async (req: Request, res: Response, next: NextFunction) => {
    cardProfileController.getProfiles(req, res);
  }
);

cardRouter.get('/getone/:id', 
  authentication, 
  authorizeRole(['admin', 'user']), 
  async (req: Request, res: Response, next: NextFunction) => {
    cardProfileController.getProfile(req, res);
  }
);

cardRouter.put('/update/:id', 
  authentication, 
  authorizeRole(['admin', 'user']), 
  async (req: Request, res: Response, next: NextFunction) => {
    cardProfileController.updateProfile(req, res);
  }
);

cardRouter.delete('/delete/:id',
  authentication,
  authorizeRole(['admin', 'user']),
  async (req: Request, res: Response, next: NextFunction) => {
    cardProfileController.deleteCardProfile(req, res);
  }
);



export default cardRouter;