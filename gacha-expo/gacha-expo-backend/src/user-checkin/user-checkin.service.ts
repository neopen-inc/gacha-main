import { Injectable } from '@nestjs/common';
import { CreateUserCheckinDto } from './dto/create-user-checkin.dto';
import { UpdateUserCheckinDto } from './dto/update-user-checkin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCheckin } from './entities/user-checkin.entity';
import { Repository } from 'typeorm';
import { PointTransactionsService } from '../point-transactions/point-transactions.service';
import { CheckinConfigService } from '../checkin-config/checkin-config.service';
import { findWithPagination } from '../utils/find-with-pagination';
import { UserCheckinListQueryOptionsDto } from './dto/user-checkin-list-query-options.dto';
import { getJSTDateString, getJSTYesterdayDateString } from '@common-utils/lib/lib/date';

@Injectable()
export class UserCheckinService {
  constructor(
    @InjectRepository(UserCheckin) private readonly userCheckinRepository: Repository<UserCheckin>,
    private readonly checkinConfigsService: CheckinConfigService,
    private readonly pointTransactionsService: PointTransactionsService
  ) {}
  async create(createUserCheckinDto: CreateUserCheckinDto) {
    const checkinDate = getJSTDateString();
    const checkinConfigs = await this.checkinConfigsService.findAll();
    const checkin = await this.userCheckinRepository.findOneBy({
      userId: createUserCheckinDto.userId,
      checkinDate,
    });
    if (checkinConfigs.length === 0) {
      return {
        message: 'checkin config not found',
      };
    }
    if (!checkin) {
      const checkinYesterday = await this.userCheckinRepository.findOneBy({
        userId: createUserCheckinDto.userId,
        checkinDate: getJSTYesterdayDateString(),
      });
      let continues = checkinYesterday ? checkinYesterday.continues + 1 : 1;
      const yesterdayMatches = checkinConfigs.find(
        (config) => config.days === (checkinYesterday?.continues || 0)
      );
      if (yesterdayMatches && yesterdayMatches.clearPoints) {
        continues = 1;
      }
      const matches = checkinConfigs.find((config) => config.days === continues);
      if (matches) {
        await this.pointTransactionsService.create(createUserCheckinDto.userId, {
          type: 'checkin',
          amount: matches.points,
          reason: `${checkinDate} 連続${continues}日チェックインしました。`,
        });
      }
      const userCheckin = this.userCheckinRepository.create({
        ...createUserCheckinDto,
        checkinDate: getJSTDateString(),
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

  async findAll(query: UserCheckinListQueryOptionsDto) {
    const { userId, checkinDate, ...rest } = query;
    return findWithPagination(this.userCheckinRepository, {
      ...rest,
      where: {
        ...(userId ? { userId } : {}),
        ...(checkinDate ? { checkinDate } : {}),
      },
    });
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
