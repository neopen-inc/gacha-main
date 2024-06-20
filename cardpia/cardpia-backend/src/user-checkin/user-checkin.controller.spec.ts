import { Test, TestingModule } from '@nestjs/testing';
import { UserCheckinController } from './user-checkin.controller';
import { UserCheckinService } from './user-checkin.service';

describe('UserCheckinController', () => {
  let controller: UserCheckinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCheckinController],
      providers: [UserCheckinService],
    }).compile();

    controller = module.get<UserCheckinController>(UserCheckinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
