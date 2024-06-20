import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { encrypt } from '../utils/crypto';

import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { setUserPoints } from '../utils/cache';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRedis() private redis: Redis,
  ) { }

  async login(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !compareSync(pass, user.password)) {
      throw new UnauthorizedException();
    }
    await setUserPoints(this.redis, user.id, user.points);
    const payload = { sub: user.id, type: user.type, status: user.status };
    return {
      id: user.id,
      token: encrypt(
        await this.jwtService.signAsync(payload),
        this.configService.get<string>('encrypt.secretKey'),
      ),
    };
  }
}
