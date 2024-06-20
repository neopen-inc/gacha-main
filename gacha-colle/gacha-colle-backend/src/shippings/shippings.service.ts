import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipping } from './entities/shipping.entity';
import { Repository } from 'typeorm';
import { LineItem } from '../line-items/entities/line-item.entity';
import { ShippingListQueryOptions } from './dto/shipping-list-query-options.dto';
import { findWithPagination } from '../utils/find-with-pagination';
import { Address } from '../addresses/entities/address.entity';

@Injectable()
export class ShippingsService {
  constructor(
    @InjectRepository(Shipping)
    private shippingRepository: Repository<Shipping>,
    @InjectRepository(LineItem)
    private lineItemRepository: Repository<LineItem>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) { }
  async create(createShippingDto: CreateShippingDto) {
    const { lineItems, ...rest } = createShippingDto;
    const addressId = rest.addressId;
    const address = await this.addressRepository.findOneBy({ id: addressId });
    if (!address) {
      throw new BadRequestException('Address not found');
    }
    const addressInfo = JSON.stringify({
      postcode: address.postcode,
      name: address.firstName + address.lastName,
      phoneNumber: address.phoneNumber,
      addressline1: address.addressline1,
      addressline2: address.addressline2,
      addressline3: address.addressline3,
    });
    const shipping = this.shippingRepository.create({
      ...rest,
      addressInfo,
      status: 'waiting',
    });
    const createdShip = await this.shippingRepository.save(shipping);
    await this.lineItemRepository
      .createQueryBuilder()
      .update(LineItem)
      .set({ shippingId: createdShip.id, status: 'waiting_for_ship' })
      .where('id IN (:...lineItems) ', { lineItems })
      .andWhere('userId = :userId ', { userId: rest.userId })
      .execute();
    return createdShip;
  }

  async findAll(shippingOptions: ShippingListQueryOptions) {
    const { status, ...rest } = shippingOptions;
    return findWithPagination(this.shippingRepository, {
      ...rest,
      where: status ? { status } : {},
      relations: ['lineItems', 'user'],
    });
  }

  async findOne(id: string) {
    return this.shippingRepository.findOne({
      where: { id },
      relations: ['lineItems', 'lineItems.card', 'user'],
    });
  }

  async update(id: string, updateShippingDto: UpdateShippingDto) {
    await this.lineItemRepository
      .createQueryBuilder()
      .update(LineItem)
      .set({ status: 'shipped' })
      .where({ shippingId: id })
      .execute();
    return await this.shippingRepository.update(id, updateShippingDto);
  }

  async remove(id: string) {
    return this.shippingRepository.softDelete(id);
  }
}
