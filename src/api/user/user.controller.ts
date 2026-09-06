import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Delete,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@/modules/security/guards/auth.guard';
import { CurrentAuthUser } from '@/modules/security/guards/current-auth-user.guard';
import type { JwtPayload } from '@/types/jwt-payload.type';
import { UpdateUserProfileDto } from '@/modules/user-profile/dto/update-user-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentAuthUser() user: JwtPayload) {
    return this.userService.me(user.id);
  }

  @Patch('update')
  @UseGuards(AuthGuard)
  update(
    @CurrentAuthUser() user: JwtPayload,
    @Body() dto: UpdateUserProfileDto,
  ) {
    return this.userService.update(user.id, dto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  deleteMe(@CurrentAuthUser() user: JwtPayload) {
    return this.userService.delete(user.id);
  }
}
