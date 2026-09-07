import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { EXCEPTION_MESSAGES } from './constants/exception-messages.constant';
import { UserGetPayload, UserSelect } from '@generated/prisma/models';
import { UpdateUserProfileDto } from '@/modules/user-profile/dto/update-user-profile.dto';
import { UserProfileService } from '@/modules/user-profile/user-profile.service';
import { UserMode } from '@generated/prisma/enums';

type UserResponseProps<T extends UserSelect> = Promise<UserGetPayload<{
  select: T;
}> | null>;

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userProfileService: UserProfileService,
  ) {}

  async create<S extends UserSelect>(
    createUserDto: CreateUserDto,
    options: S,
  ): UserResponseProps<S> {
    return this.prismaService.user.create({
      data: createUserDto,
      select: options,
    });
  }

  async delete(id: number): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ConflictException(EXCEPTION_MESSAGES.userNotFound);
    }

    await this.prismaService.user.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async me(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    const userProfile = await this.prismaService.userProfile.findUnique({
      where: {
        userId: id,
      },
    });

    if (!user) {
      throw new ConflictException(EXCEPTION_MESSAGES.userNotFound);
    }

    if (!userProfile) {
      throw new ConflictException(EXCEPTION_MESSAGES.userNotFound);
    }

    const { id: userId, email, createdAt } = user;
    const {
      firstName,
      lastName,
      avatarUrl,
      phone,
      phoneCode,
      birthDate,
      bio,
      phoneVerifiedAt,
      updatedAt,
      countryId,
      stateId,
      cityId,
    } = userProfile;

    return {
      id: userId,
      email,
      createdAt,
      firstName,
      lastName,
      avatarUrl,
      phone,
      phoneCode,
      birthDate,
      bio,
      phoneVerifiedAt,
      updatedAt,
      activeMode: user.activeMode,
      countryId,
      stateId,
      cityId,
    };
  }

  async findByEmail<S extends UserSelect>(
    email: string,
    options: S,
  ): UserResponseProps<S> {
    return this.prismaService.user.findUnique({
      where: { email },
      select: options,
    });
  }

  async getUserById<S extends UserSelect>(
    id: number,
    options: S,
  ): UserResponseProps<S> {
    return this.prismaService.user.findUnique({
      where: { id },
      select: options,
    });
  }

  update(userId: number, dto: UpdateUserProfileDto) {
    return this.userProfileService.updateUserProfile(userId, dto);
  }

  async switchMode(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        activeMode: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const activeMode =
      user.activeMode === UserMode.GUEST ? UserMode.HOST : UserMode.GUEST;

    const res = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        activeMode,
      },
      select: {
        id: true,
        activeMode: true,
      },
    });

    return {
      activeMode: res.activeMode,
    };
  }
}
