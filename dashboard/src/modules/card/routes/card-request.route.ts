import { NextFunction, Request, Response, Router } from "express";

import  cardRequestController  from '../Request/controller/card-request.controller';
import authentication from "../../../middlewares/authentication";
import authorizeRole from "../../../middlewares/authorise";

const cardRequestRouter = Router();

cardRequestRouter.post('/create',
  authentication,
  authorizeRole(['user','admin']),
  async (req: Request, res: Response, next: NextFunction) => {
  cardRequestController.createRequest(req, res);
});

cardRequestRouter.get('/getone/:id', 
  authentication,
  authorizeRole(['user','admin']),
  async (req: Request, res: Response, next: NextFunction) => {
  cardRequestController.getCardRequestById(req, res);
});

cardRequestRouter.get('/getall', 
  authentication,
  authorizeRole(['admin', 'user']),
  async (req: Request, res: Response, next: NextFunction) => {
  cardRequestController.getAllCardRequests(req, res);
});

cardRequestRouter.put('/update/:id', 
  authentication,
  authorizeRole(['admin', 'user']),
  async (req: Request, res: Response, next: NextFunction) => {
  cardRequestController.updateRequestStatus(req, res);
});

export default cardRequestRouter;