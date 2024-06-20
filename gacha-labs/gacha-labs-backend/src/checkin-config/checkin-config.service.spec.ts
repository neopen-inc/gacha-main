import { Test, TestingModule } from '@nestjs/testing';
import { CheckinConfigService } from './checkin-config.service';

describe('CheckinConfigService', () => {
  let service: CheckinConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckinConfigService],
    }).compile();

    service = module.get<CheckinConfigService>(CheckinConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
