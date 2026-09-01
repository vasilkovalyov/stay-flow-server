import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SecurityModule } from '@/modules/security/security.module';
import { UserProfileModule } from '@/modules/user-profile/user-profile.module';

@Module({
  imports: [SecurityModule, UserProfileModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
