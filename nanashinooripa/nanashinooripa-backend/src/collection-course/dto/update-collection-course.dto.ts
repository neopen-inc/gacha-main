import { PartialType } from '@nestjs/swagger';
import { CreateCollectionCourseDto } from './create-collection-course.dto';

export class UpdateCollectionCourseDto extends PartialType(
  CreateCollectionCourseDto,
) {}
