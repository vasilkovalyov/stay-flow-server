import { IsString, MaxLength, Length, IsEmail } from 'class-validator';
import { VALIDATION_MESSAGES } from '../constants/validation-messages.constant';

export class VerifyEmailDto {
  @IsEmail(
    {},
    {
      message: VALIDATION_MESSAGES.email.invalid,
    },
  )
  email: string;
  @IsString({
    message: VALIDATION_MESSAGES.code.invalid,
  })
  @Length(6)
  @MaxLength(6)
  code: string;
}
