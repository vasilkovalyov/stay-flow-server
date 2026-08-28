import { MinLength, MaxLength, IsString, IsEmail } from 'class-validator';
import { VALIDATION_MESSAGES } from '../constants/validation-messages.constant';
import { IsStrongPassword } from '../decorators/password.decorator';

export class RegistrationDto {
  @IsString({
    message: VALIDATION_MESSAGES.lastName.required,
  })
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString({
    message: VALIDATION_MESSAGES.lastName.required,
  })
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsEmail(
    {},
    {
      message: VALIDATION_MESSAGES.email.invalid,
    },
  )
  email: string;

  @IsStrongPassword()
  password: string;
}
