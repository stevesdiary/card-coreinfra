import { Request, Response } from "express";
import * as yup from 'yup';
import { 
  createCardRequest, 
  getCardRequestById,
  getAllCardRequests,
  updateCardRequestStatus 
} from '../../services/card-request.service';
import { cardRequestStatusSchema, createRequestSchema, idSchema } from '../../../../utils/validator';
import { CardRequestStatus } from '../../Request/models/card-request.model';

const cardRequestController = {
  createRequest: async (req: Request, res: Response): Promise<Response> => {
    try {
      const user_id = req.user?.id ?? '';
      if (!user_id) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized: User ID not found'
        });
      }
      const request_body = {...req.body, user_id}
      console.log('REQUEST BODY', request_body);
        const validatedData = await createRequestSchema.validate(request_body, { 
          abortEarly: false,
          stripUnknown: true
        });

      const cardRequest = await createCardRequest(validatedData);

      return res.status(cardRequest.statusCode).json(cardRequest);
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  getCardRequestById: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const cardRequest = await getCardRequestById(id);

      return res.status(cardRequest.statusCode).json(cardRequest);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  getAllCardRequests: async (req: Request, res: Response): Promise<Response> => {
    try {
      const cardRequests = await getAllCardRequests();

      return res.status(cardRequests.statusCode).json(cardRequests);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  updateRequestStatus: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = await idSchema.validate(req.params, { abortEarly: false });
      const validatedData = await cardRequestStatusSchema.validate(req.body, { abortEarly: false });
      
      const cardRequest = await updateCardRequestStatus(id, validatedData.status as string);

      return res.status(cardRequest.statusCode).json(cardRequest);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.inner.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};

export default cardRequestController;
