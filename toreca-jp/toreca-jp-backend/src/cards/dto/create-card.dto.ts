import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({
    type: 'string',
    description: 'カードの名前',
    example: 'ニャース',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'カードの説明',
    example: 'ニャース、かわいいよ',
  })
  @IsOptional()
  description?: string;
 
  @ApiProperty({
    type: 'string',
    description: 'サムネイル画像のURL',
    example: 'http://example.com/example.jpg',
  })
  @IsString()
  thumbnail: string;
  @ApiProperty({
    type: 'string',
    description: 'サブ画像のURL',
    example: 'http://example.com/example.jpg,http://example.com/example.jpg',
  })
  @IsString()
  subImages: string;

  @IsOptional()
  @IsString()
  rarity: string;

  @IsString()
  categoryId: string;
  /*
   @ApiProperty({
    type: 'string',
    description: 'グレード',
    example: '1等賞',
  })
  @IsString()
  grade: string;
  @ApiProperty({
    type: 'string',
    description: 'カードのポイント',
    example: 100,
  })
  @IsOptional()
  points: number;
  @ApiProperty({
    type: 'string',
    description: 'オリパID',
    example: 'collectionId',
  })
  @IsString()
  collectionId: string;
  @ApiProperty({
    type: 'number',
    description: '在庫数',
    example: 100,
  })
  @IsOptional()
  inventory: number;
  @ApiProperty({
    type: 'number',
    description: '初期在庫数',
    example: 100,
  })
  @IsOptional()
  initialInventory: number;

  @IsOptional()
  @IsOptional()
  appearance: number;
  */
  @IsIn(['active', 'inactive'])
  @IsOptional()
  status?: 'active' | 'inactive';

}
