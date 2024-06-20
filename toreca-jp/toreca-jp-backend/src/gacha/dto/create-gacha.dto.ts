import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class CreateGachaDto {
  @ApiProperty({
    type: 'string',
    example: 'aaa',
    description: 'ガチャを引くオリパのID',
  })
  @IsString()
  collectionId: string;
  @ApiProperty({
    type: 'string',
    example: 'aaa',
    description: 'ガチャを引くユーザーのID',
  })
  @IsString()
  userId: string;
  @ApiProperty({
    type: 'string',
    example: 'gacha',
    description: 'gacha タイプ, oneは一回ガチャ, tenは十連ガチャ',
    enum: ['one', 'ten'],
  })
  @IsIn(['one', 'ten'])
  type: 'one' | 'ten';
}
