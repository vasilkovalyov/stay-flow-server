import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanupModule } from './modules/cleanup/cleanup.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { LocationModule } from './api/location/location.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CleanupModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    LocationModule,
  ],
})
export class AppModule {}
