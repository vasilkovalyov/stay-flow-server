import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanupModule } from './modules/cleanup/cleanup.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CleanupModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
