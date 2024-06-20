import { Module, forwardRef } from '@nestjs/common';
import { CarouselsService } from './carousels.service';
import { CarouselsController } from './carousels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carousel } from './entities/carousel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carousel])],
  controllers: [CarouselsController],
  providers: [CarouselsService],
  exports: [TypeOrmModule],
})
export class CategoriesModule {}
