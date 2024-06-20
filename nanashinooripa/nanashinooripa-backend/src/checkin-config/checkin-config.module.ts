import { Module } from '@nestjs/common';
import { CheckinConfigService } from './checkin-config.service';
import { CheckinConfigController } from './checkin-config.controller';
import { CheckinConfig } from './entities/checkin-config.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CheckinConfig])],
  controllers: [CheckinConfigController],
  providers: [CheckinConfigService],
  exports: [CheckinConfigService, TypeOrmModule],
})
export class CheckinConfigModule {}
