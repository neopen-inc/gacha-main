import { Test, TestingModule } from '@nestjs/testing';
import { PointPackagesController } from './point-packages.controller';
import { PointPackagesService } from './point-packages.service';

describe('PointPackagesController', () => {
  let controller: PointPackagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointPackagesController],
      providers: [PointPackagesService],
    }).compile();

    controller = module.get<PointPackagesController>(PointPackagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
