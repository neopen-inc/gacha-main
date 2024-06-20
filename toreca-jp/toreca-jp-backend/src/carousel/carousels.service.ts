import { Injectable } from '@nestjs/common';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Carousel } from './entities/carousel.entity';
import { findWithPagination } from '../utils/find-with-pagination';
import { CarouselListQueryOptionsDto } from './dto/carousel-list-query-options.dto';

@Injectable()
export class CarouselsService {
  constructor(
    @InjectRepository(Carousel)
    private carouselRepository: Repository<Carousel>,
  ) {}
  async create(createCarouselDto: CreateCarouselDto) {
    const carousel = this.carouselRepository.create(createCarouselDto);
    await this.carouselRepository.insert(carousel);
    return carousel;
  }

  async findAll(options: CarouselListQueryOptionsDto) {
    const { status, ...rest } = options;
    return findWithPagination(this.carouselRepository, {
      ...rest,
      where: { ...(status ? { status: 'active' } : {}) },
    });
  }

  async findOne(id: string) {
    return this.carouselRepository.findOneBy({ id });
  }
  async findCollections(carouselId: string) {
    const collections = (
      await this.carouselRepository.findOne({
        where: { id: carouselId, status: 'active' },
        relations: ['collections'],
      })
    ).collections;
    return collections;
  }

  async update(id: string, updateCarouselDto: UpdateCarouselDto) {
    await this.carouselRepository.update(id, updateCarouselDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.carouselRepository.softDelete(id);
  }
}
