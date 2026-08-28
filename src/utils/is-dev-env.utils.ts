import { ConfigService } from '@nestjs/config';

export function isDevEnv(config: ConfigService) {
  return config.getOrThrow<string>('NODE_ENV') === 'development';
}
