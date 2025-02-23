import * as yup from 'yup';

import { Request, Response } from "express";
import { createFeeSchema, idSchema, updateFeeSchema } from '../../../../utils/validator'
import { createCardFee, updateCardFee, getCardFees, deleteCardFee } from '../../services/card-fee.service';
import { abort } from 'process';
import { DataType } from 'sequelize-typescript';




const feeController = {
  createFee: async (req: Request, res:Response ) => {
    try {
      const createFeeData = await createFeeSchema.validate(req.body, {abortEarly: false});
      const create = await createCardFee(createFeeData);
      return res.status(create.statusCode).json(create)
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

      console.error('Fee Creation Error:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  updateFee: async (req: Request, res: Response) => {
    try {
      const { id } = await idSchema.validate(req.params, {abortEarly: false});
      const feeData = await updateFeeSchema.validate(req.body, {abortEarly: false});

      const feeUpdate = await updateCardFee(id, feeData);
      if (feeUpdate)
      return res.status(feeUpdate.statusCode).json({
        status: feeUpdate.status,
        message: feeUpdate.message,
        data: feeUpdate.data
      })

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

      console.error('Fee update Error:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  getAllFees: async (req: Request, res: Response) => {
    try {
      const getFees = await getCardFees();
      return res.status(getFees.statusCode).json({
        getFees
      });
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

      console.error('Fee update Error:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  deleteFee: async (req: Request, res: Response) => {
    try {
      const { id } = await idSchema.validate(req.params, {abortEarly: false});
      const destroyRecord = await deleteCardFee(id);
      return res.status(destroyRecord.statusCode).json(destroyRecord);
      
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

      console.error('Fee delete Error:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

}

export default feeController;