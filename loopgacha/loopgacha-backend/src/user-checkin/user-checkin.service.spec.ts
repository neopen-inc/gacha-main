import { Test, TestingModule } from '@nestjs/testing';
import { UserCheckinService } from './user-checkin.service';

describe('UserCheckinService', () => {
  let service: UserCheckinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCheckinService],
    }).compile();

    service = module.get<UserCheckinService>(UserCheckinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
