import { Module } from '@nestjs/common';
import { CollectionCourseService } from './collection-course.service';
import { CollectionCourseController } from './collection-course.controller';

@Module({
  controllers: [CollectionCourseController],
  providers: [CollectionCourseService]
})
export class CollectionCourseModule {}
