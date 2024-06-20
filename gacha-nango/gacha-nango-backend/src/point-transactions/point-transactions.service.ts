import { Injectable } from '@nestjs/common';
import { CreatePointTransactionDto } from './dto/create-point-transaction.dto';
import { UpdatePointTransactionDto } from './dto/update-point-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointTransaction } from './entities/point-transaction.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PointTransactionsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,
  ) {}
  async create(
    userId: string,
    createPointTransactionDto: CreatePointTransactionDto,
  ) {
    const pointTransaction = this.pointTransactionRepository.create({
      ...createPointTransactionDto,
      userId,
    });
    await this.userRepository.increment(
      { id: userId },
      'points',
      createPointTransactionDto.amount,
    );
    return await this.pointTransactionRepository.save(pointTransaction);
  }

  async findByUser(userId: string) {
    return this.pointTransactionRepository.findBy({ userId });
  }

  async findOne(userId: string, id: string) {
    return this.pointTransactionRepository.findOneBy({ userId, id });
  }

  async update(
    userId: string,
    id: string,
    updatePointTransactionDto: UpdatePointTransactionDto,
  ) {
    return this.pointTransactionRepository.update(
      { userId, id },
      updatePointTransactionDto,
    );
  }

  async remove(userId: string, id: string) {
    return this.pointTransactionRepository.softDelete({ userId, id });
  }
}
