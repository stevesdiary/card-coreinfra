import { Response, Request } from 'express';

import { loginUser, logoutUser } from '../service.ts/login.service';
import { loginSchema } from '../../../utils/validator';
import { loginData } from '../types/type';

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const validateLogin = await loginSchema.validate(req.body, { abortEarly: false });
    const { email, password } = validateLogin as loginData;
    const user = await loginUser(email, password, res);

    return res.status(user.statusCode).send({
      status: (user.status),
      message: (user.message),
      data: (user.data)
    })
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).send({
      error: error
    })
  }
}

export const logout = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await logoutUser(res);
    return res.status(user.statusCode).send({
      status: (user.status),
      message: (user.message),
      data: (user.data)
    })
  } catch (error) {
    return res.status(500).send({
      error: error
    })
  }
}
