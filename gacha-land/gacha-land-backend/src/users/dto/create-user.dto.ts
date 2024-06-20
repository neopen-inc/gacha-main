import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    type: 'string',
    example: 'ガチャ太郎',
    description: 'ユーザー名',
  })
  name: string;
  @IsEmail()
  @ApiProperty({
    type: 'string',
    example: 'gacha@email.com',
    description:
      'ユーザーのメールアドレス、ログインに使用します。システム上で唯一性を確認',
  })
  email: string;
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty({
    type: 'string',
    example: 'password',
    description: 'ユーザーのパスワード',
  })
  password: string;
}
