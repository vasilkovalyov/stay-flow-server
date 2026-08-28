export const EXCEPTION_MESSAGES = {
  invalidCreds: 'Invalid email or password',
  userExist: 'User with this email already exists',
  invalidRefreshToken: 'Invalid refresh token',
  userNotFound: 'User not found',
  invalidVerificationCode: 'Invalid verification code',
  expiredVerificationCode: 'Verification code has expired',
  invalidExpiredResetToken: 'Invalid or expired reset token',
  passwordDoNotMatch: 'Passwords do not match',
} as const;
