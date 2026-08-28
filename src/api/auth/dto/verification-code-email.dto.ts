import { IsEmail } from 'class-validator';
import { VALIDATION_MESSAGES } from '../constants/validation-messages.constant';

export class VerificationCodeEmailDto {
  @IsEmail(
    {},
    {
      message: VALIDATION_MESSAGES.email.invalid,
    },
  )
  email: string;
}
