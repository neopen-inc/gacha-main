import { Test, TestingModule } from '@nestjs/testing';
import { PointPackagesService } from './point-packages.service';

describe('PointPackagesService', () => {
  let service: PointPackagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointPackagesService],
    }).compile();

    service = module.get<PointPackagesService>(PointPackagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
