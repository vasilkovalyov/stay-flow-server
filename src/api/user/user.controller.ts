import { Controller, Get, UseGuards, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@/modules/security/guards/auth.guard';
import { CurrentAuthUser } from '@/modules/security/guards/current-auth-user.guard';
import type { JwtPayload } from '@/types/jwt-payload.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentAuthUser() user: JwtPayload) {
    return this.userService.me(user.id);
  }

  @Delete()
  @UseGuards(AuthGuard)
  deleteMe(@CurrentAuthUser() user: JwtPayload) {
    return this.userService.delete(user.id);
  }
}
