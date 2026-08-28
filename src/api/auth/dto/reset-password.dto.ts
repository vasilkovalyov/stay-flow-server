import { IsString } from 'class-validator';
import { IsStrongPassword } from '../decorators/password.decorator';
import { Match } from '../decorators/password-mach.decorator';
import { EXCEPTION_MESSAGES } from '../constants/exception-messages.constant';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsStrongPassword()
  password: string;

  @IsStrongPassword()
  @Match('password', {
    message: EXCEPTION_MESSAGES.passwordDoNotMatch,
  })
  confirmPassword: string;
}
