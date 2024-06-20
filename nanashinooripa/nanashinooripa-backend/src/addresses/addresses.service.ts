import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }
  async create(userId: string, createAddressDto: CreateAddressDto) {
    const userAddressCount = await this.addressRepository.count({
      where: { id: userId },
    });
    if (userAddressCount >= 5) {
      throw new ForbiddenException('one user can have up to 5 addresses');
    }
    const address = this.addressRepository.create({
      ...createAddressDto,
      user: await this.userRepository.findOneByOrFail({ id: userId }),
    });
    await this.addressRepository.insert(address);
    return address;
  }

  async findAll(userId: string) {
    return await this.addressRepository.find({
      where: { user: { id: userId } },
    });
    //.addresses;
  }

  async findOne(userId: string, id: string) {
    return this.addressRepository.findOneBy({ userId, id });
  }

  async update(userId: string, id: string, updateAddressDto: UpdateAddressDto) {
    await this.addressRepository.update({ userId, id }, updateAddressDto);
    return this.findOne(userId, id);
  }

  async remove(userId: string, id: string) {
    return await this.addressRepository.softDelete({ userId, id });
  }
}
