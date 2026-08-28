import { IsEmail } from 'class-validator';
import { VALIDATION_MESSAGES } from '../constants/validation-messages.constant';

export class ForgotPasswordDto {
  @IsEmail(
    {},
    {
      message: VALIDATION_MESSAGES.lastName.required,
    },
  )
  email: string;
}
