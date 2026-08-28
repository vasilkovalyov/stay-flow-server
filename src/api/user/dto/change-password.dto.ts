import { IsStrongPassword } from '@/api/auth/decorators/password.decorator';

export class ChangePasswordDto {
  @IsStrongPassword()
  password: string;

  @IsStrongPassword()
  confirmPassword: string;
}
