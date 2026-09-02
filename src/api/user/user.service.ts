import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { EXCEPTION_MESSAGES } from './constants/exception-messages.constant';
import { UserMeDtoResponse } from './dto/response.dto';
import { UserGetPayload, UserSelect } from '@generated/prisma/models';

type UserResponseProps<T extends UserSelect> = Promise<UserGetPayload<{
  select: T;
}> | null>;

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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

  async me(id: number): Promise<UserMeDtoResponse> {
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
      birthDate,
      bio,
      country,
      city,
      language,
      locale,
      timezone,
      phoneVerifiedAt,
      updatedAt,
    } = userProfile;

    return {
      id: userId,
      email,
      createdAt,
      firstName,
      lastName,
      avatarUrl,
      phone,
      birthDate,
      bio,
      country,
      city,
      language,
      locale,
      timezone,
      phoneVerifiedAt,
      updatedAt,
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
}
