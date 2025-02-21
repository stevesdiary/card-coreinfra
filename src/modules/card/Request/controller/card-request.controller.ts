import { Request, Response } from "express";
import * as yup from 'yup';
import { 
  createCardRequest, 
  getCardRequestById, 
  updateCardRequestStatus 
} from '../../services/card-request.service';
import { CardType } from '../../profile/card-profile.model';
import { CardRequestStatus } from '../../Request/models/card-request.model';

const cardRequestController = {
  createRequest: async (req: Request, res: Response): Promise<Response> => {
    try {
      const validationSchema = yup.object().shape({
        user_id: yup.string().uuid().required(),
        requested_card_type: yup.mixed().oneOf(Object.values(CardType)).required(),
        additional_notes: yup.string().optional()
      });

      const validatedData = await validationSchema.validate(req.body, { abortEarly: false });

      const cardRequest = await createCardRequest(validatedData);

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

  updateRequestStatus: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const validationSchema = yup.object().shape({
        status: yup.mixed().oneOf(Object.values(CardRequestStatus)).required()
      });

      const validatedData = await validationSchema.validate(req.body, { abortEarly: false });

      const cardRequest = await updateCardRequestStatus(id, validatedData.status);

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
