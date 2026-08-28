export const VALIDATION_MESSAGES = {
  firstName: {
    required: 'First name is required',
  },
  lastName: {
    required: 'Last name is required',
  },
  email: {
    invalid: 'Enter a valid email address',
  },
  password: {
    required: 'Password is required',
    min: 'Password must be at least 8 characters',
    mismatch: 'Passwords do not match',
    uppercase: 'At least one uppercase letter',
    number: 'At least one number',
  },
  confirmPassword: {
    required: 'Please confirm your password',
  },
  terms: {
    required: 'You must accept the terms to continue',
  },
  code: {
    invalid: 'Enter the 6-digit code',
  },
} as const;
