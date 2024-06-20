import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CollectionCourseService } from './collection-course.service';
import { CreateCollectionCourseDto } from './dto/create-collection-course.dto';
import { UpdateCollectionCourseDto } from './dto/update-collection-course.dto';

@Controller('collection-course')
export class CollectionCourseController {
  constructor(
    private readonly collectionCourseService: CollectionCourseService,
  ) {}

  @Post()
  create(@Body() createCollectionCourseDto: CreateCollectionCourseDto) {
    return this.collectionCourseService.create(createCollectionCourseDto);
  }

  @Get()
  findAll() {
    return this.collectionCourseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionCourseService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCollectionCourseDto: UpdateCollectionCourseDto,
  ) {
    return this.collectionCourseService.update(+id, updateCollectionCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionCourseService.remove(+id);
  }
}
