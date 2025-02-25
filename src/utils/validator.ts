import * as yup from 'yup';
import { CardType, CardStatus, Currency } from '../modules/card/card-profile/model/card-profile.model';
import { CardRequestStatus } from '../modules/card/Request/models/card-request.model';
import { FeeType, FrequencyType } from '../modules/card/Fee/models/card.fee.model';

export const userRegistrationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  first_name: yup.string().required('Name is required'),
  last_name: yup.string().required('Last name is required'),
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
  first_name: yup.string().optional(),
  last_name: yup.string().optional(),
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
  user_id: yup.string().uuid().optional(),
  card_holder_name: yup.string().required('card holder name is required'),
  card_type: yup.mixed().oneOf(Object.values(CardType)).required('Card type is required'),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const userVerificationSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  code: yup.string().required('Verification code is required'),
});

export const emailSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required')
});

export const idSchema = yup.object().shape({
  id: yup.string().uuid('Invalid card profile ID').required('Card profile ID is required')
});

export const cardProfileUpdateSchema = yup.object().shape({
  card_profile_id: yup.string().uuid().optional(),
  status: yup.mixed().oneOf(Object.values(CardStatus)),
  // user_id: yup.string().uuid().required('User id is required'),
  card_number: yup.string().optional(),
  card_holder_name: yup.string().optional(),
  card_type: yup.mixed().oneOf(Object.values(CardType)).optional(),
});

export const cardStatusSchema = yup.object().shape({
  status: yup.mixed().oneOf(Object.values(CardStatus)).required('Status is required'),
});

export const cardRequestStatusSchema = yup.object().shape({
  status: yup.mixed().oneOf(Object.values(CardRequestStatus)).required('Status is required'),
});

export const paginationSchema = yup.object().shape({
  page: yup.number().positive().optional(),
  limit: yup.number().positive().optional(),
});

export const createRequestSchema = yup.object().shape({
  user_id: yup.string().uuid().optional(),
  requested_card_type: yup.mixed().oneOf(Object.values(CardType)).required('Requested card type is required'),
  initiator: yup.string().uuid().optional(),
  branch_name: yup.string().required('Branch name is required'),
  batch_number: yup.string().optional(),
  quantity: yup.number().positive().required('Quantity is required'),
  additional_notes: yup.string().optional(),
  // status: yup.mixed().oneOf(Object.values(CardRequestStatus)).optional(),
});

export const createFeeSchema = yup.object().shape({
  card_profile_id: yup.string().uuid().required('Card profile id is required'),
  card_type: yup.mixed().oneOf(Object.values(CardType)).optional(),
  fee_type: yup.mixed().oneOf(Object.values(FeeType)).optional(),
  currency: yup.mixed().oneOf(Object.values(Currency)).optional(),
  frequency: yup.mixed().oneOf(Object.values(FrequencyType)).optional(),
  amount: yup.number().required('Amount is required')
})

export const updateFeeSchema = yup.object().shape({
  card_type: yup.mixed().oneOf(Object.values(CardType)).optional(),
  fee_type: yup.mixed().oneOf(Object.values(FeeType)).optional(),
  currency: yup.mixed().oneOf(Object.values(Currency)).optional(),
  frequency: yup.mixed().oneOf(Object.values(FrequencyType)).optional(),
  is_paid: yup.boolean().optional(),
  is_active: yup.boolean().optional(),
  amount: yup.number().required('Amount is required')
})
