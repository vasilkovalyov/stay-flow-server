import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { SecurityModule } from '@/modules/security/security.module';

@Module({
  imports: [SecurityModule],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
