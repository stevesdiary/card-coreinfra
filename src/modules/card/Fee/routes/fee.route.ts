import { Response, Request, Router, NextFunction } from 'express';
import authentication from '../../../../middlewares/authentication';
import authorizeRole from '../../../../middlewares/authorise';
import feeController from '../controller/fee.controller';

const feeRouter = Router();

feeRouter.post('/create', 
  authentication,
  authorizeRole(['admin']),
  async (req: Request, res: Response, next: NextFunction) => {
    feeController.createFee(req, res);
  }
)
feeRouter.put('/update/:id', 
  authentication,
  authorizeRole(['admin']),
  async (req: Request, res: Response, next: NextFunction) => {
    feeController.updateFee(req, res);
  }
)

feeRouter.get('/all', 
  authentication,
  authorizeRole(['admin']),
  async (req: Request, res: Response, next: NextFunction) => {
    feeController.getAllFees(req, res);
  }
)

feeRouter.delete('/delete/:id', 
  authentication,
  authorizeRole(['admin']),
  async (req: Request, res: Response, next: NextFunction) => {
    feeController.deleteFee(req, res);
  }
)

export default feeRouter;