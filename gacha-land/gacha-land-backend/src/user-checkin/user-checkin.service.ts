import { Injectable } from '@nestjs/common';
import { CreateUserCheckinDto } from './dto/create-user-checkin.dto';
import { UpdateUserCheckinDto } from './dto/update-user-checkin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCheckin } from './entities/user-checkin.entity';
import { Repository } from 'typeorm';
import { date } from '@common-utils';
import { PointTransactionsService } from '../point-transactions/point-transactions.service';
import { CheckinConfigService } from '../checkin-config/checkin-config.service';

@Injectable()
export class UserCheckinService {
  constructor(
    @InjectRepository(UserCheckin)
    private readonly userCheckinRepository: Repository<UserCheckin>,
    private readonly checkinConfigsService: CheckinConfigService,
    private readonly pointTransactionsService: PointTransactionsService,
  ) {}
  async create(createUserCheckinDto: CreateUserCheckinDto) {
    const checkinDate = date.getJSTDateString();
    const checkinConfigs = await this.checkinConfigsService.findAll();
    const checkin = await this.userCheckinRepository.findOneBy({
      userId: createUserCheckinDto.userId,
      checkinDate,
    });
    if (!checkin) {
      const checkinYesterday = await this.userCheckinRepository.findOneBy({
        userId: createUserCheckinDto.userId,
        checkinDate: date.getJSTYesterdayDateString(),
      });
      let continues = checkinYesterday ? checkinYesterday.continues + 1 : 1;
      const yesterdayMatches = checkinConfigs.find(
        (config) => config.days === (checkinYesterday?.continues || 0),
      );
      if (yesterdayMatches && yesterdayMatches.clearPoints) {
        continues = 1;
      }
      const matches = checkinConfigs.find(
        (config) => config.days === continues,
      );
      if (matches) {
        await this.pointTransactionsService.create(
          createUserCheckinDto.userId,
          {
            type: 'checkin',
            amount: matches.points,
            reason: `${checkinDate} 連続${continues}日チェックインしました。`,
          },
        );
      }
      const userCheckin = this.userCheckinRepository.create({
        ...createUserCheckinDto,
        checkinDate: date.getJSTDateString(),
        continues,
      });
      await this.userCheckinRepository.save(userCheckin);
      return {
        ...userCheckin,
        message: 'checkin success',
      };
    }
    return {
      ...checkin,
      message: 'already checked in',
    };
  }

  async findAll() {
    return `This action returns all userCheckin`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} userCheckin`;
  }

  async update(id: string, updateUserCheckinDto: UpdateUserCheckinDto) {
    return `This action updates a #${id} userCheckin`;
  }

  async remove(id: string) {
    return `This action removes a #${id} userCheckin`;
  }
}
