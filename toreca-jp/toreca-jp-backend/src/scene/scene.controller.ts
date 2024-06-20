import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SceneService } from './scene.service';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { RequireAdmin } from '../auth/decorators/admin.decorator';

@Controller('scenes')
export class SceneController {
  constructor(private readonly sceneService: SceneService) { }

  @RequireAdmin()
  @Post()
  async create(@Body() createSceneDto: CreateSceneDto) {
    return this.sceneService.create(createSceneDto);
  }

  @RequireAdmin()
  @Get()
  async findAll() {
    return this.sceneService.findAll();
  }

  @Get(':grade')
  async findOne(@Param('grade') grade: string) {
    return this.sceneService.findOneByGrade(grade);
  }

  @RequireAdmin()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSceneDto: UpdateSceneDto,
  ) {
    return this.sceneService.update(id, updateSceneDto);
  }

  @RequireAdmin()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sceneService.remove(id);
  }
}
