import * as yup from 'yup';
import { CardType, CardStatus } from '../modules/card/profile/card-profile.model';

export const userRegistrationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().trim()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#-+={}\[\]\\]).{6,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
  ),
  confirm_password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  phone: yup.string().optional(),
  role: yup.string().optional(),
});

export const userUpdateSchema = yup.object().shape({
  name: yup.string().optional(),
  email: yup.string().email('Invalid email format').optional(),
  password: yup.string().trim()
  .min(6, 'Password must be at least 6 characters')
  .optional(),
  confirm_password: yup.string()
  .min(6, 'Password must be at least 6 characters')
  .oneOf([yup.ref('password')], 'Passwords must match'),
  phone: yup.string().optional(),
  role: yup.string().optional(),
});

export const cardValidationSchema = yup.object().shape({
  user_id: yup.string().uuid().required(),
  card_holder_name: yup.string().required(),
  card_type: yup.mixed().oneOf(Object.values(CardType)).required(),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const userVerificationSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  code: yup.string().required('Verification code is required'),
});

export const idSchema = yup.string().uuid('Id must be a valid uuid').required('Id is required');

export const cardProfileUpdateSchema = yup.object().shape({
  status: yup.mixed().oneOf(Object.values(CardStatus)),
  balance: yup.number().positive(),
});

export const paginationSchema = yup.object().shape({
  page: yup.number().positive().required(),
  limit: yup.number().positive().required(),
});
