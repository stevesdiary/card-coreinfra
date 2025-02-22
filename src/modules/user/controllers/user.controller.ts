import { Request as ExpressRequest, Response } from 'express';

import { deleteUser, getAllUsers, getOneUser, updateUser } from '../service.ts/user.registration';
import { userUpdateSchema, idSchema } from '../../../utils/validator';
import { UserResponseData } from '../types/type';


const userController = {
  getAllUsers: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const users: UserResponseData = await getAllUsers()
      return res.status(users.statusCode).send({
        status: users.status,
        message: users.message,
        data: users.data
      });
    } catch (error) {
      const errorResponse: UserResponseData = {
        statusCode: 500,
        status: "error",
        message: "internal server error",
        data: null
      };

      return res.status(errorResponse.statusCode).json({
        status: errorResponse.status,
        message: errorResponse.message,
        data: errorResponse.data
      });
      }
    
  },

  getOneUser: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const { id } = await idSchema.validate(req.params, { abortEarly: false });
      const user = await getOneUser(id);
      return res.status(user.statusCode).send({ status: user.status, message: user.message, data: user.data });
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  },

  updateUser: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const { id } = await idSchema.validate(req.params, { abortEarly: false });
      const validatedData = await userUpdateSchema.validate(req.body, { 
        abortEarly: false 
      });
      const update = await updateUser(id, validatedData);
      return res.status(update.statusCode).send({ status: update.status, message: update.message, data: update.data });
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  },

  deleteUser: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const { id } = await idSchema.validate(req.params, { abortEarly: false });
      const user = await deleteUser(id);
      return res.status(user.statusCode).send({ status: user.status, message: user.message, data: user.data });
    } catch (error) {
      return res.status(500).send({
        error: error
      });
    }
  }
};

export default userController;
