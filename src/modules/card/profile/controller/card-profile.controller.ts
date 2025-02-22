import { Request, Response } from "express";
import * as yup from 'yup';

import { 
  createCardProfile, 
  getCardProfileById, 
  updateCardProfile,
  getCardProfiles,
  deleteCardProfile
} from '../../services/card-profile.service';
import { CardStatus } from '../card-profile.model';
import { cardValidationSchema, idSchema, paginationSchema, cardProfileUpdateSchema } from '../../../../utils/validator';

const cardProfileController = {
  createProfile: async (req: Request, res: Response): Promise<Response> => {
    try {
      const user_id = req.user?.id ?? '';
      
      if (!user_id) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized: User ID not found'
        });
      }

      const profileBody = { ...req.body, user_id };
      
      const validatedData = await cardValidationSchema.validate(profileBody, { abortEarly: false });
      const cardProfile = await createCardProfile({ 
        ...validatedData, 
        user_id, 
        status: CardStatus.PENDING 
      });

      return res.status(cardProfile.statusCode || 201).json(cardProfile);
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

      console.error('Card Profile Creation Error:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  getProfile: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = await idSchema.validate(req.params, { abortEarly: false });
      const cardProfile = await getCardProfileById(id);

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
      const { limit = 10, page = 1 } = await paginationSchema.validate(req.query, { abortEarly: false });
      const cardProfiles = await getCardProfiles(Number(limit), Number(page));

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
      const  { id } = await idSchema.validate(req.params, { abortEarly: false });

      const validatedData = await cardProfileUpdateSchema.validate(req.body, { abortEarly: false });
      const userId = req.user?.id;
      const data = {
        user_id: userId,
        status: validatedData.status,
        // card_holder_name: validatedData.card_holder_name
      };
      const cardProfile = await updateCardProfile(id, data);

      return res.status(cardProfile.statusCode).json(cardProfile);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        console.log( error );
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.inner.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      console.error('Update Profile Error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  deleteCardProfile: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = await idSchema.validate(req.params, { abortEarly: false });
      const cardProfile = await deleteCardProfile(id);

      return res.status(cardProfile.statusCode).json(cardProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default cardProfileController;
