import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class LoginDto {
  @ApiProperty({
    type: 'string',
    example: 'gacha@email.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    type: 'string',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
