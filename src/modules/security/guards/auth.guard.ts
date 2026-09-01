import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@/api/auth/interfaces/jwt.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.accessToken as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Access token is missing');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);

      request.user = {
        id: payload.sub,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Access token is missing');
    }
  }
}
