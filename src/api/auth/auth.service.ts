import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserService } from '../user/user.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { EXCEPTION_MESSAGES } from './constants/exception-messages.constant';
import { ConfigService } from '@nestjs/config';
import {
  DAYS_7,
  EXPIRATION_EMAIL_VERIFICATION_TOKEN_MIN,
  EXPIRATION_FORGOT_PASSWORD_TOKEN_MIN,
} from '@/constants/common.constant';
import type { Response, Request } from 'express';
import { isDevEnv } from '@/utils/is-dev-env.utils';
import { JwtPayload } from './interfaces/jwt.interface';
import { randomBytes, createHash, randomInt } from 'crypto';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { RESPONSE_MESSAGES } from './constants/response-messages.constant';
import {
  getDateExpirationDays,
  getDateExpirationMinutes,
  isExpiredDate,
} from '@/utils/dates.utils';
import { HASH_TOKEN_ALGORITHM } from '@/constants/auth.constant';

@Injectable()
export class AuthService {
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly JWT_REFRESH_SECRET: string;
  private readonly COOKIE_DOMAIN: string;
  private readonly FRONTEND_URL: string;

  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.JWT_REFRESH_SECRET =
      configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
    this.FRONTEND_URL = configService.getOrThrow<string>('FRONTEND_URL');
  }

  private setCookie(res: Response, token: string) {
    const isDev = isDevEnv(this.configService);

    res.cookie('refreshToken', token, {
      httpOnly: true,
      expires: getDateExpirationDays(DAYS_7),
      domain: this.COOKIE_DOMAIN,
      secure: !isDev,
      sameSite: isDev ? 'none' : 'lax',
    });
  }

  private async generateTokens(userId: number) {
    const payload = {
      sub: userId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.JWT_REFRESH_SECRET,
        expiresIn: this.JWT_REFRESH_TOKEN_TTL as StringValue,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private getHashToken(token: string) {
    return createHash(HASH_TOKEN_ALGORITHM).update(token).digest('hex');
  }

  private generatePasswordResetToken() {
    const token = randomBytes(32).toString('hex');

    return {
      token,
      tokenHash: this.getHashToken(token),
    };
  }

  async signIn(res: Response, dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new ConflictException(EXCEPTION_MESSAGES.invalidCreds);
    }

    const isRightPassword = await this.passwordService.compare(
      password,
      user.password,
    );

    if (!isRightPassword) {
      throw new ConflictException(EXCEPTION_MESSAGES.invalidCreds);
    }

    const { id } = user;
    const { accessToken, refreshToken } = await this.generateTokens(id);

    this.setCookie(res, refreshToken);

    return {
      id,
      accessToken,
    };
  }

  async signUp(dto: RegistrationDto) {
    const { email, password } = dto;
    const user = await this.userService.findByEmail(email);

    if (user) {
      throw new ConflictException(EXCEPTION_MESSAGES.userExist);
    }

    const hashedPassword = await this.passwordService.hash(password);

    await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    return {
      message: RESPONSE_MESSAGES.userCreateSuccessul,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return {
        message: RESPONSE_MESSAGES.forgotPasswordResetLink,
      };
    }

    const { token, tokenHash } = this.generatePasswordResetToken();
    const expiresAt = getDateExpirationMinutes(
      EXPIRATION_FORGOT_PASSWORD_TOKEN_MIN,
    );

    const userId = user.id;

    await this.prismaService.$transaction([
      this.prismaService.passwordResetToken.deleteMany({
        where: {
          userId: userId,
        },
      }),

      this.prismaService.passwordResetToken.create({
        data: {
          tokenHash,
          userId: userId,
          expiresAt,
        },
      }),
    ]);

    // TODO: send email

    return {
      message: RESPONSE_MESSAGES.forgotPasswordResetLink,
    };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      return {
        success: true,
        message: RESPONSE_MESSAGES.verificationCode,
      };
    }

    const hashCode = this.getHashToken(dto.code);
    const userId = user.id;

    const verificationCode =
      await this.prismaService.emailVerificationCode.findUnique({
        where: {
          userId: userId,
        },
      });

    if (!verificationCode) {
      throw new BadRequestException(EXCEPTION_MESSAGES.invalidVerificationCode);
    }

    if (isExpiredDate(verificationCode.expiresAt)) {
      await this.prismaService.emailVerificationCode.delete({
        where: {
          id: verificationCode.id,
        },
      });

      throw new BadRequestException(EXCEPTION_MESSAGES.expiredVerificationCode);
    }

    if (verificationCode.codeHash !== hashCode) {
      throw new BadRequestException(EXCEPTION_MESSAGES.invalidVerificationCode);
    }

    await this.prismaService.$transaction([
      this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          emailVerifiedAt: new Date(),
        },
      }),

      this.prismaService.emailVerificationCode.delete({
        where: {
          id: verificationCode.id,
        },
      }),
    ]);

    return {
      message: RESPONSE_MESSAGES.emailVerifiedSuccess,
    };
  }

  async verificationCodeEmail(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return {
        message: RESPONSE_MESSAGES.verificationCode,
      };
    }

    if (user.emailVerifiedAt) {
      return {
        message: RESPONSE_MESSAGES.emailAlreadyVerified,
      };
    }

    const code = randomInt(100000, 1000000).toString();
    const codeHash = this.getHashToken(code);
    const expiresAt = getDateExpirationMinutes(
      EXPIRATION_EMAIL_VERIFICATION_TOKEN_MIN,
    );
    const userId = user.id;

    await this.prismaService.$transaction([
      this.prismaService.emailVerificationCode.deleteMany({
        where: {
          userId: userId,
        },
      }),

      this.prismaService.emailVerificationCode.create({
        data: {
          codeHash,
          userId: userId,
          expiresAt,
        },
      }),
    ]);

    // TODO: send code email

    return {
      message: RESPONSE_MESSAGES.verificationCode,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, password } = dto;

    const tokenHash = this.getHashToken(token);

    const resetToken = await this.prismaService.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (!resetToken) {
      throw new BadRequestException(RESPONSE_MESSAGES.verificationTokenExpired);
    }

    if (isExpiredDate(resetToken.expiresAt)) {
      await this.prismaService.passwordResetToken.delete({
        where: {
          id: resetToken.id,
        },
      });

      throw new BadRequestException(
        EXCEPTION_MESSAGES.invalidExpiredResetToken,
      );
    }

    const hashedPassword = await this.passwordService.hash(password);

    await this.prismaService.$transaction([
      this.prismaService.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          password: hashedPassword,
        },
      }),

      this.prismaService.passwordResetToken.delete({
        where: {
          id: resetToken.id,
        },
      }),
    ]);

    return {
      message: RESPONSE_MESSAGES.resetPassword,
    };
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'] as string;

    if (!refreshToken) {
      throw new UnauthorizedException(EXCEPTION_MESSAGES.invalidRefreshToken);
    }

    const payload: JwtPayload = await this.jwtService.verifyAsync(
      refreshToken,
      {
        secret: this.JWT_REFRESH_SECRET,
      },
    );

    if (!payload) {
      throw new NotFoundException();
    }

    const user = await this.userService.getUserById(payload.sub, {
      id: true,
    });

    if (!user) {
      throw new NotFoundException(EXCEPTION_MESSAGES.userNotFound);
    }

    const { id } = user;
    const tokens = await this.generateTokens(id);

    this.setCookie(res, tokens.refreshToken);

    return {
      id,
      accessToken: tokens.accessToken,
    };
  }
}
