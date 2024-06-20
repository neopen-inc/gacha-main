import { Test, TestingModule } from '@nestjs/testing';
import { CollectionCourseController } from './collection-course.controller';
import { CollectionCourseService } from './collection-course.service';

describe('CollectionCourseController', () => {
  let controller: CollectionCourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionCourseController],
      providers: [CollectionCourseService],
    }).compile();

    controller = module.get<CollectionCourseController>(CollectionCourseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
