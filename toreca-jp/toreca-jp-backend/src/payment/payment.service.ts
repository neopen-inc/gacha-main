import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { ListQueryOptionsDto } from '../dto/list-query-options.dto';
import { findWithPagination } from '../utils/find-with-pagination';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
  ) {}
  async create(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(payment);
  }

  async findAll(options: ListQueryOptionsDto) {
    return findWithPagination(this.paymentRepository, {
      ...options,
      relations: ['user', 'pointPackage'],
    });
  }

  async findOne(id: string) {
    return this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'pointPackage'],
    });
  }
  async findOneBy(options: {
    sessionId?: string;
    userId?: string;
    packageId?: string;
    status?: 'pending' | 'cancel' | 'success';
  }): Promise<Payment> {
    return this.paymentRepository.findOneBy(options);
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentRepository.update(id, updatePaymentDto);
  }

  async remove(id: string) {
    return this.paymentRepository.softDelete(id);
  }
}
