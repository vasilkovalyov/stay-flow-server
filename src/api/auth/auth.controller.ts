import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-passord.dto';
import type { Response, Request } from 'express';
import { VerificationCodeEmailDto } from './dto/verification-code-email.dto';
import { Throttle } from '@nestjs/throttler';
import { getMinutesInMs } from '@/utils/times.utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @Throttle({
    default: {
      limit: 10,
      ttl: getMinutesInMs(20),
    },
  })
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(res, dto);
  }

  @Post('sign-up')
  @Throttle({
    default: {
      limit: 10,
      ttl: getMinutesInMs(20),
    },
  })
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() dto: RegistrationDto) {
    return this.authService.signUp(dto);
  }

  @Post('forgot-password')
  @Throttle({
    default: {
      limit: 5,
      ttl: getMinutesInMs(20),
    },
  })
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Patch('verify-email')
  @Throttle({
    default: {
      limit: 5,
      ttl: getMinutesInMs(20),
    },
  })
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('verification-code-email')
  @Throttle({
    default: {
      limit: 5,
      ttl: getMinutesInMs(20),
    },
  })
  @HttpCode(HttpStatus.OK)
  verificationCodeEmail(@Body() dto: VerificationCodeEmailDto) {
    return this.authService.verificationCodeEmail(dto.email);
  }

  @Post('reset-password')
  @Throttle({
    default: {
      limit: 5,
      ttl: getMinutesInMs(20),
    },
  })
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('refresh')
  @Throttle({
    default: {
      limit: 30,
      ttl: getMinutesInMs(60),
    },
  })
  @HttpCode(HttpStatus.OK)
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(req, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
