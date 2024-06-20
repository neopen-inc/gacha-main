import { Test, TestingModule } from '@nestjs/testing';
import { CollectionCourseService } from './collection-course.service';

describe('CollectionCourseService', () => {
  let service: CollectionCourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectionCourseService],
    }).compile();

    service = module.get<CollectionCourseService>(CollectionCourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
