import { applyDecorators } from '@nestjs/common';
import { IsString, Matches, MinLength } from 'class-validator';
import { VALIDATION_MESSAGES } from '../constants/validation-messages.constant';

export function IsStrongPassword() {
  return applyDecorators(
    IsString(),
    MinLength(8, {
      message: VALIDATION_MESSAGES.password.min,
    }),
    Matches(/[A-Z]/, {
      message: VALIDATION_MESSAGES.password.uppercase,
    }),
    Matches(/\d/, {
      message: VALIDATION_MESSAGES.password.number,
    }),
  );
}
