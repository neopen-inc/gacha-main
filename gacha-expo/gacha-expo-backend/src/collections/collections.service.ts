import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { In, Not, Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { findWithPagination } from '../utils/find-with-pagination';
import { CollectionListQueryOptions } from './dto/collection-list-queryoptions.dto';
import { CollectionIp } from './entities/collection_ip.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionIp)
    private collectionIpRepository: Repository<CollectionIp>,
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

  async createCollectionIp(collectionId: string, ip: string) {
    const collectionIp = this.collectionIpRepository.create({
      collectionId,
      ip,
    });
    await this.collectionIpRepository.insert(collectionIp);
    return collectionIp;
  }

  async findAllCollectionByIp(ip: string) {
    const collectionIp = await this.collectionIpRepository.find({
      where: { ip },
    });
    return collectionIp.map((collection) => collection.collectionId);
  }

  async findAll(options: CollectionListQueryOptions) {
    const { categoryId, status, once, excludeIdList, ...rest } = options;
    return findWithPagination(this.collectionRepository, {
      ...rest,
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(status ? { status } : {}),
        ...(once !== undefined ? { once } : {}),
        ...(excludeIdList && excludeIdList.length > 0
          ? { id: Not(In(excludeIdList)) }
          : {}),
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
