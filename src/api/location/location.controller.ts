import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { AuthGuard } from '@/modules/security/guards/auth.guard';

@Controller()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('countries')
  @UseGuards(AuthGuard)
  getCountries() {
    return this.locationService.getCountries();
  }

  @Get('phone-codes')
  @UseGuards(AuthGuard)
  getPhoneCodes() {
    return this.locationService.getPhoneCodes();
  }

  @Get('countries/:countryId/states')
  @UseGuards(AuthGuard)
  countryStates(@Param('countryId') countryId: string) {
    return this.locationService.countryStates(countryId);
  }

  @Get('states/:stateId/cities')
  @UseGuards(AuthGuard)
  stateCities(@Param('stateId') stateId: string) {
    return this.locationService.stateCities(stateId);
  }
}
