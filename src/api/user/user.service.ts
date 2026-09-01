import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@generated/prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { EXCEPTION_MESSAGES } from './constants/exception-messages.constant';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.prismaService.user.create({
      data: createUserDto,
    });
  }

  async me(id: number): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ConflictException(EXCEPTION_MESSAGES.userNotFound);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserById(
    id: number,
    options?: Partial<Record<keyof User, boolean>>,
  ): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: options,
    });
  }
}
