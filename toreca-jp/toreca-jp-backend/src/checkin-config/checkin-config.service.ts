import { Injectable } from '@nestjs/common';
import { CreateCheckinConfigDto } from './dto/create-checkin-config.dto';
import { UpdateCheckinConfigDto } from './dto/update-checkin-config.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckinConfig } from './entities/checkin-config.entity';

@Injectable()
export class CheckinConfigService {
  constructor(
    @InjectRepository(CheckinConfig)
    private checkinConfigRepository: Repository<CheckinConfig>,
  ) {}
  create(createCheckinConfigDto: CreateCheckinConfigDto) {
    const checkinConfig = this.checkinConfigRepository.create(
      createCheckinConfigDto,
    );
    return this.checkinConfigRepository.save(checkinConfig);
  }

  findAll() {
    return this.checkinConfigRepository.find();
  }

  findOne(id: string) {
    return this.checkinConfigRepository.findOneBy({ id });
  }

  update(id: string, updateCheckinConfigDto: UpdateCheckinConfigDto) {
    return this.checkinConfigRepository.update(id, updateCheckinConfigDto);
  }

  remove(id: string) {
    return this.checkinConfigRepository.softDelete(id);
  }
}
