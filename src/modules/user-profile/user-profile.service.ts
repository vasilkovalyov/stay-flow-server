import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  getUserProfileById(userId: number) {
    return this.prismaService.userProfile.findUnique({
      where: { id: userId },
    });
  }

  async createUserProfile(userId: number, dto: CreateUserProfileDto) {
    await this.prismaService.userProfile.create({
      data: {
        userId: userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
  }

  updateUserProfile(userId: number, dto: UpdateUserProfileDto) {
    const {
      firstName,
      lastName,
      phone,
      phoneCode,
      birthDate,
      bio,
      countryId,
      stateId,
      cityId,
    } = dto;

    return this.prismaService.userProfile.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        phoneCode,
        birthDate,
        bio,
        countryId,
        stateId,
        cityId,
      },
      select: {
        firstName: true,
        lastName: true,
        phone: true,
        phoneCode: true,
        birthDate: true,
        bio: true,
        countryId: true,
        stateId: true,
        cityId: true,
      },
    });
  }
}
