import { Request as ExpressRequest, Response } from 'express';
import * as yup from 'yup';

import { registerUser, verifyUser } from '../service.ts/user.registration';
import { userRegistrationSchema, userVerificationSchema } from '../../../utils/validator';
import { TypedRequest, UserData, UserResponse } from '../types/type';


const userRegistration = {
  create: async (req: TypedRequest, res: Response): Promise<Response> => {
      try {
        const validatedData = await userRegistrationSchema.validate(req.body, { 
          abortEarly: false 
        });

        const { confirm_password, ...userData } = validatedData as UserData;
        const user = await registerUser(userData);
        if (user.statusCode === 201 ){
          return res.status(user.statusCode).send({
            status: (user.status),
            message: (user.message + ' Check your email for verification code'),
            data: (user.data) });
        }
        return res.status(user.statusCode).json( user);
        
      } catch (error) {
          if (error instanceof yup.ValidationError) {
            return res.status(400).send({ error: error.errors });
          };
          console.error('Error creating user:', error);
          return res.status(500).send({ message: 'Error creating user', error: error });
      }
  },

  verifyUser: async (req: ExpressRequest, res: Response): Promise<Response> => {
    try {
      const verify = await userVerificationSchema.validate(req.body, { abortEarly: false });
      console.log( 'VVERIFY', verify)
      const { email, code } = verify as { email: string, code: string };
      // const verifyPayload = verify as { email: string, code: string };
      const user = await verifyUser({ email, code });
      return res.status(user.statusCode).send({ status: (user.status), message: (user.message), data: (user.data)})
    } catch (error) {
      return res.status(500).send({
        error: error
      })
    }
  },
}
export default userRegistration;
