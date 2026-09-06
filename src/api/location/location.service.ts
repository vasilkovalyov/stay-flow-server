import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCountries() {
    return await this.prismaService.country.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getPhoneCodes() {
    return await this.prismaService.country.findMany({
      select: {
        id: true,
        emoji: true,
        phonecode: true,
      },
    });
  }

  async countryStates(countryId: string) {
    return await this.prismaService.countryState.findMany({
      where: {
        countryId: parseInt(countryId),
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async stateCities(stateId: string) {
    return await this.prismaService.city.findMany({
      where: {
        countryStateId: parseInt(stateId),
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
