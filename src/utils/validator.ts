import * as yup from 'yup';

export const userRegistrationSchema = yup.object().shape({
  id: yup.string().uuid().optional(),
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
  // email: yup.string().email('Invalid email format').optional(),
  password: yup.string().trim()
  .min(6, 'Password must be at least 6 characters')
  .optional(),
  confirm_password: yup.string()
  .min(6, 'Password must be at least 6 characters')
  .oneOf([yup.ref('password')], 'Passwords must match')

});

export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const userVerificationSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  code: yup.string().required('Verification code is required'),
});

