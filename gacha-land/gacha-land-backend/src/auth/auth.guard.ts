import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { decrypt } from '../utils/crypto';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { ALLOW_INACTIVE_KEY } from './decorators/allow-inactive.decorator';
import { REQUIRE_ADMIN_KEY } from './decorators/admin.decorator';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,

    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const allowInactive = this.reflector.getAllAndOverride<boolean>(
      ALLOW_INACTIVE_KEY,
      [context.getHandler(), context.getClass()],
    );
    const requireAdmin = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_ADMIN_KEY,
      [context.getHandler(), context.getClass()],
    );
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      if (isPublic) {
        return true;
      }
      throw new UnauthorizedException('ログインしてください。');
    }
    let user: undefined | User = undefined;
    try {
      const decryptedToken = decrypt(
        token,
        this.configService.get<string>('encrypt.secretKey'),
      );
      const payload = await this.jwtService.verifyAsync(decryptedToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });
      if (requireAdmin && payload.type !== 'admin') {
        throw new ForbiddenException('権限が足りない');
      }

      user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      request['user'] = {
        id: payload.sub,
        type: payload.type,
        status: payload.status,
      };
      if (isPublic) {
        return true;
      }
      if (allowInactive) {
        return true;
      }
      return payload.status === 'active';
    } catch (e) {
      if (isPublic) {
        return true;
      }
      throw e;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (!request.headers.authorization) {
      return undefined;
    }
    const [type, token] =
      ((request.headers.authorization || '') as string).split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
