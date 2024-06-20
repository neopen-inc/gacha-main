import { Injectable } from '@nestjs/common';
import { CreateCollectionCourseDto } from './dto/create-collection-course.dto';
import { UpdateCollectionCourseDto } from './dto/update-collection-course.dto';

@Injectable()
export class CollectionCourseService {
  create(createCollectionCourseDto: CreateCollectionCourseDto) {
    return 'This action adds a new collectionCourse';
  }

  findAll() {
    return `This action returns all collectionCourse`;
  }

  findOne(id: number) {
    return `This action returns a #${id} collectionCourse`;
  }

  update(id: number, updateCollectionCourseDto: UpdateCollectionCourseDto) {
    return `This action updates a #${id} collectionCourse`;
  }

  remove(id: number) {
    return `This action removes a #${id} collectionCourse`;
  }
}
