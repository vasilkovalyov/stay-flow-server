import { IsEmail, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../constants/validation-messages.constant';

export class LoginDto {
  @IsEmail(
    {},
    {
      message: VALIDATION_MESSAGES.email.required,
    },
  )
  email: string;

  @IsString({
    message: VALIDATION_MESSAGES.password.required,
  })
  password: string;
}
