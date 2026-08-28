import { MinLength, MaxLength, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../constants/validation-messages.constant';
import { IsStrongPassword } from '@/api/auth/decorators/password.decorator';

export class CreateUserDto {
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

  @IsString({
    message: VALIDATION_MESSAGES.email.invalid,
  })
  email: string;

  @IsStrongPassword()
  password: string;
}
