import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { sendMail } from '../utils/send-email';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../token/token.service';
import { findWithPagination } from '../utils/find-with-pagination';
import { LineItemsService } from '../line-items/line-items.service';
import { LineItem } from '../line-items/entities/line-item.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { readFileSync } from 'fs';
import { join } from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    private tokenService: TokenService,
    private lineItemService: LineItemsService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(LineItem)
    private lineItemRepository: Repository<LineItem>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await hash(password, 10);
    const userEntity = this.userRepository.create({
      ...rest,
      status: 'inactive',
      points: 0,
      password: hashedPassword,
    });
    const user = await this.userRepository.save(userEntity);
    const token = await this.tokenService.createOnetimeToken({
      id: user.id,
      type: 'verify-email',
    });
    const url = `${this.configService.get<string>(
      'email.email_verification_url',
    )}?token=${token}`.replace('{{userId}}', user.id);
    const template = readFileSync(
      `${process.cwd()}/${this.configService.get<string>(
        'email.email_verification_template',
      )}`,
    )
      .toString()
      .replace('{{url}}', url);
    try {
      await sendMail(
        this.configService.get<string>('sendGrid.apiKey'),
        this.configService.get<string>('sendGrid.from'),
        {
          from: this.configService.get<string>('sendGrid.from'),
          html: template,
          text: template,
          subject: this.configService.get<string>(
            'email.email_verification_subject',
          ),
          to: rest.email,
        },
      );
    } catch (e) {
      console.log(JSON.stringify(e));
    }
    return user;
  }

  async findAll(top: number, skip: number, orderby = 'createdAt DESC') {
    return findWithPagination(this.userRepository, { top, skip, orderby });
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
  async findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['defaultAddress'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    return this.userRepository.softDelete(id);
  }
  async resetPassword({ password, token }: ResetPasswordDto) {
    const data = await this.tokenService.checkOnetimeToken(token);
    if (data && data.userId && data.type === 'reset-password') {
      const user = await this.userRepository.findOneBy({ id: data.userId });
      const hashedPassword = await hash(password, 10);
      if (user) {
        await this.userRepository.update(user.id, { password: hashedPassword });
        return {
          message: 'password reset',
        };
      }
    }
    throw new Error('error reset password');
  }
  async sendResetPasswordEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error('User not found');
    }
    const token = await this.tokenService.createOnetimeToken({
      id: user.id,
      type: 'reset-password',
    });
    const url = `${this.configService.get<string>(
      'email.email_verification_url',
    )}?token=${token}`.replace('{{userId}}', user.id);
    const template = readFileSync(
      `${process.cwd()}/${this.configService.get<string>(
        'email.email_verification_template',
      )}`,
    )
      .toString()
      .replace('{{url}}', url);
    await sendMail(
      this.configService.get<string>('sendGrid.apiKey'),
      this.configService.get<string>('sendGrid.from'),
      {
        from: this.configService.get<string>('sendGrid.from'),
        html: template,
        text: template,
        subject: this.configService.get<string>(
          'email.email_verification_subject',
        ),
        to: email,
      },
    );
    return {
      message: 'verify email sent',
    };
  }
  async sendVerificationEmail(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = await this.tokenService.createOnetimeToken({
      id: user.id,
      type: 'verify-email',
    });
    const url = `${this.configService.get<string>(
      'email.email_verification_url',
    )}?token=${token}`.replace('{{userId}}', user.id);
    const template = readFileSync(
      `${process.cwd()}/${this.configService.get<string>(
        'email.email_verification_template',
      )}`,
    )
      .toString()
      .replace('{{url}}', url);
    await sendMail(
      this.configService.get<string>('sendGrid.apiKey'),
      this.configService.get<string>('sendGrid.from'),
      {
        from: this.configService.get<string>('sendGrid.from'),
        html: template,
        text: template,
        subject: this.configService.get<string>(
          'email.email_verification_subject',
        ),
        to: user.email,
      },
    );
    return;
  }
  async verifyEmail(id: string, token: string) {
    // TODO 一時できな対処法
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.userRepository.update(user.id, { status: 'active' });
      return {
        message: 'email verified',
      };
    }
    const data = await this.tokenService.checkOnetimeToken(token);
    if (data && data.id && data.id === id && data.type === 'verify-email') {
      const user = await this.userRepository.findOneBy({ id: data.userId });
      if (user) {
        await this.userRepository.update(user.id, { status: 'active' });
        return {
          message: 'email verified',
        };
      }
    }
    throw new ForbiddenException('Token is invalid');
  }
}
