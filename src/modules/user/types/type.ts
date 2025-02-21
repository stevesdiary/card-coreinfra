import { Request, Response } from 'express';
import { UserRole } from '../../../utils/roles';
import { CardType } from '../../card/profile/card-profile.model';

export interface UserAttributes {
    name?: string;
    email?: string;
    password?: string;
    confirm_password?: string;
}

export interface CardNumberGenerationOptions {
  cardType: CardType;
  issuerCode?: string;
}
export interface UserData extends Omit<UserAttributes, 'id'> {
  confirm_password?: string;
}

export interface TypedRequest extends Request {
  body: {
    name: string;
    email: string;
    username: string;
    password: string;
    confirm_password: string;
  };
}

export interface UserData {
  name?: string;
  email?: string;
  username: string;
  password?: string;
  confirm_password?: string;
}

export interface UserResponse {
  statusCode: number;
  status: 'success' | 'fail' | 'error';
  message: string;
  data: string[] | null;
}

export interface UserController {
  create(req: TypedRequest, res: Response): Promise<Response>;
  updateUser(req: TypedRequest, res: Response): Promise<Response>;
}
export interface ServiceResponse {
  statusCode: number;
  status: string;
  message: string;
  data: any | any[];
}
export interface UserResponseData {
  statusCode: number;
  status: string, // 'success' | 'fail' | 'error';
  message: string;
  data: any | null;
}

export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
};

export interface EmailResponse {
  statusCode: number;
  status: string;
  message: string;
  data: any;
}

export interface loginData {
  email: string;
  password: string;
}

export interface UserType {
  id: string;
  email: string;
  role: string;
}

export interface DecodedUser {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export interface User{
  id: string;
  email: string;
  role: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  // iat?: number;
  // exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export interface CardProfile {
  cardNumber: string;
  creationDate: Date;
  expiryDate: Date;
  cardType: CardType;
  cvv2: string;
  // Other properties
}