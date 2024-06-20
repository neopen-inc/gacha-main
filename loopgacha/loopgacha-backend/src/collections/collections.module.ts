import { Module, forwardRef } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { CollectionIp } from './entities/collection_ip.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection, CollectionIp]),
    forwardRef(() => UsersModule),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [TypeOrmModule],
})
export class CollectionsModule {}
