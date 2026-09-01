import { IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../constants/validation-messages.constant';
import { IsStrongPassword } from '@/api/auth/decorators/password.decorator';

export class CreateUserDto {
  @IsString({
    message: VALIDATION_MESSAGES.lastName.required,
  })
  @IsString({
    message: VALIDATION_MESSAGES.email.invalid,
  })
  email: string;

  @IsStrongPassword()
  password: string;
}
