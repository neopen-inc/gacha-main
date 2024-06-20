import { Injectable } from '@nestjs/common';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { Repository } from 'typeorm';
import { Scene } from './entities/scene.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SceneService {
  constructor(
    @InjectRepository(Scene) private sceneRepository: Repository<Scene>,
  ) { }
  async create(createSceneDto: CreateSceneDto) {
    const scene = this.sceneRepository.create(createSceneDto);
    return await this.sceneRepository.save(scene);
  }

  async findAll() {
    return this.sceneRepository.find();
  }

  async findOne(id: string) {
    return this.sceneRepository.findOneBy({ id });
  }

  async findOneByGrade(grade: string) {
    return this.sceneRepository.findOneBy({ grade });
  }

  async update(id: string, updateSceneDto: UpdateSceneDto) {
    return this.sceneRepository.update(id, updateSceneDto);
  }

  async remove(id: string) {
    return this.sceneRepository.delete(id);
  }
}
