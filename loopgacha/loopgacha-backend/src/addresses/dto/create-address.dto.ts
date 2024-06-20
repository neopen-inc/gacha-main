import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    type: 'string',
    example: 'John Doe',
    maxLength: 255,
    minLength: 1,
    description: '宛先',
  })
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  firstNameKana: string;

  @IsString()
  lastNameKana: string;
  @ApiProperty({
    type: 'string',
    example: '東京都渋谷区',
    maxLength: 255,
    minLength: 1,
    description: '住所第一行、例えば都道府県市区町村',
  })
  @IsString()
  addressline1: string;
  @ApiProperty({
    type: 'string',
    example: '神南',
    maxLength: 255,
    minLength: 1,
    description: '住所第二行、例えば町名',
  })
  @IsString()
  addressline2: string;
  @ApiPropertyOptional({
    type: 'string',
    example: '１−１−１',
    maxLength: 255,
    minLength: 1,
    description: '住所第三行、例えば丁目番地',
  })
  @IsString()
  @IsOptional()
  addressline3?: string;
  @ApiProperty({
    type: 'string',
    example: '1500041',
    maxLength: 255,
    minLength: 1,
    description: '郵便番号',
  })
  @IsString()
  postcode: string;
  @ApiProperty({
    type: 'string',
    example: '09012345678',
    maxLength: 255,
    minLength: 1,
    description: '電話番号',
  })
  @IsString()
  phoneNumber: string;
  @ApiPropertyOptional({
    type: 'string',
    example: '自宅',
    maxLength: 255,
    minLength: 1,
    description: '任意の説明',
  })
  @IsOptional()
  description?: string;
}
