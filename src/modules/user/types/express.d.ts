import { User as UserType } from '../types/type';

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}