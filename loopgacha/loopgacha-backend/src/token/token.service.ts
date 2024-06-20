import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { encrypt, decrypt } from '../utils/crypto';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }
  async createOnetimeToken(data: Record<string, string>): Promise<any> {
    const token = encrypt(
      await this.jwtService.signAsync({ data }),
      this.configService.get<string>('encrypt.secretKey'),
    );
    const tokenEntity = this.tokenRepository.create({ token, valid: true });
    await this.tokenRepository.save(tokenEntity);
    return token;
  }

  async checkOnetimeToken(token: string): Promise<any> {
    const tokenEntity = await this.tokenRepository.findOneBy({ token });
    if (tokenEntity && tokenEntity.valid) {
      await this.tokenRepository.update(tokenEntity.id, { valid: false });
      const decryptedToken = decrypt(
        token,
        this.configService.get<string>('encrypt.secretKey'),
      );
      const payload = await this.jwtService.verifyAsync(decryptedToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });
      //await this.tokenRepository.update(tokenEntity.id, { valid: false });
      return payload.data;
    }
    throw new ForbiddenException('Token is invalid');
  }
}
