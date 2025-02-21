import { Request, Response } from "express";
import * as yup from 'yup';
import { 
  createCardProfile, 
  getCardProfileById, 
  updateCardProfile,
  getCardProfiles
} from '../../services/card-profile.service';
import { CardStatus } from '../card-profile.model';
import { cardValidationSchema, idSchema, paginationSchema, cardProfileUpdateSchema } from '../../../../utils/validator';

const cardProfileController = {
  createProfile: async (req: Request, res: Response): Promise<Response> => {
    try {
      const validatedData = await cardValidationSchema.validate(req.body, { abortEarly: false });

      const cardProfile = await createCardProfile(validatedData);

      return res.status(cardProfile.statusCode).json(cardProfile);
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

  getProfile: async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = idSchema.validate(req.params, { abortEarly: false });
      const cardProfile = await getCardProfileById(id as unknown as string);

      return res.status(cardProfile.statusCode).json(cardProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  getProfiles: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { limit, page } = await paginationSchema.validate(req.query, { abortEarly: false });
      const cardProfiles = await getCardProfiles(limit, page);

      return res.status(cardProfiles.statusCode).json(cardProfiles);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  updateProfile: async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = await idSchema.validate(req.params, { abortEarly: false});

      const validatedData = await cardProfileUpdateSchema.validate(req.body, { abortEarly: false });

      const cardProfile = await updateCardProfile(id, validatedData);

      return res.status(cardProfile.statusCode).json(cardProfile);
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

export default cardProfileController;
