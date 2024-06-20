import { Test, TestingModule } from '@nestjs/testing';
import { CheckinConfigController } from './checkin-config.controller';
import { CheckinConfigService } from './checkin-config.service';

describe('CheckinConfigController', () => {
  let controller: CheckinConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckinConfigController],
      providers: [CheckinConfigService],
    }).compile();

    controller = module.get<CheckinConfigController>(CheckinConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
