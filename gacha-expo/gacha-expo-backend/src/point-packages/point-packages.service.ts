import { Injectable } from '@nestjs/common';
import { CreatePointPackageDto } from './dto/create-point-package.dto';
import { UpdatePointPackageDto } from './dto/update-point-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PointPackage } from './entities/point-package.entity';
import { Repository } from 'typeorm';
import { List } from 'lodash';
import { ListQueryOptionsDto } from '../dto/list-query-options.dto';
import { parseOrderBy } from '../utils/find-with-pagination';

@Injectable()
export class PointPackagesService {
  constructor(
    @InjectRepository(PointPackage)
    private pointPackageRepository: Repository<PointPackage>,
  ) {}
  create(createPointPackageDto: CreatePointPackageDto) {
    const pointPackage = this.pointPackageRepository.create(
      createPointPackageDto,
    );
    this.pointPackageRepository.insert(pointPackage);
    return pointPackage;
  }

  async findAll(opts: ListQueryOptionsDto) {
    return this.pointPackageRepository.find({
      ...(opts?.orderby ? { order: parseOrderBy(opts?.orderby) } : {}),
    });
  }

  async findOne(id: string) {
    return this.pointPackageRepository.findOneBy({ id });
  }

  async update(id: string, updatePointPackageDto: UpdatePointPackageDto) {
    await this.pointPackageRepository.update(id, updatePointPackageDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.pointPackageRepository.softDelete(id);
  }
}
