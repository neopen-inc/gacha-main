import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { findWithPagination } from '../utils/find-with-pagination';
import { CollectionListQueryOptions } from './dto/collection-list-queryoptions.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
  ) { }
  async create(createCollectionDto: CreateCollectionDto) {
    const { categoryId, ...rest } = createCollectionDto;
    const collectionEntity = this.collectionRepository.create({
      ...rest,
      category: { id: categoryId },
    });
    await this.collectionRepository.insert(collectionEntity);
    return collectionEntity;
  }

  async findAll(options: CollectionListQueryOptions) {
    const { categoryId, status, ...rest } = options;
    return findWithPagination(this.collectionRepository, {
      ...rest,
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(status ? { status } : {}),
      },
    });
  }

  async findOne(id: string) {
    return this.collectionRepository.findOneBy({ id });
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    return this.collectionRepository.update(id, updateCollectionDto);
  }

  async remove(id: string) {
    return this.collectionRepository.softDelete(id);
  }
}
