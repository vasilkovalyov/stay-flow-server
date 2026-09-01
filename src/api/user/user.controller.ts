import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@/modules/security/guards/auth.guard';
import { CurrentAuthUser } from '@/modules/security/guards/current-auth-user.guard';
import type { JwtPayload } from '@/types/jwt-payload.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentAuthUser() user: JwtPayload) {
    return this.userService.me(user.id);
  }
}
