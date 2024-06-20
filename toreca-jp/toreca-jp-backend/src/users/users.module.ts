import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { TokenModule } from '../token/token.module';
import { LineItemsModule } from '../line-items/line-items.module';
import { PointTransaction } from '../point-transactions/entities/point-transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PointTransaction]),
    TokenModule,
    LineItemsModule,
    forwardRef(() => TokenModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
