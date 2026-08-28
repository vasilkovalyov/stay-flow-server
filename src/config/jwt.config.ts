import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { AUTH_ALGORITHM } from '@/constants/auth.constant';

export function getJwtConfig(config: ConfigService): JwtModuleOptions {
  return {
    secret: config.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      algorithm: AUTH_ALGORITHM,
      expiresIn: config.getOrThrow('JWT_ACCESS_TOKEN_TTL'),
    },
    verifyOptions: {
      algorithms: [AUTH_ALGORITHM],
      ignoreExpiration: false,
    },
  };
}
