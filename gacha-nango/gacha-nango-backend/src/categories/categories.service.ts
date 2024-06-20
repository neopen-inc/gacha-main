import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { findWithPagination } from '../utils/find-with-pagination';
import { CategoryListQueryOptionsDto } from './dto/category-list-query-options.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.insert(category);
    return category;
  }

  async findAll(options: CategoryListQueryOptionsDto) {
    const { status, ...rest } = options;
    return findWithPagination(this.categoryRepository, {
      ...rest,
      where: { ...(status ? { status: 'active' } : {}) },
    });
  }

  async findOne(id: string) {
    return this.categoryRepository.findOneBy({ id });
  }
  async findCollections(categoryId: string) {
    const collections = (
      await this.categoryRepository.findOne({
        where: { id: categoryId, status: 'active' },
        relations: ['collections'],
      })
    ).collections;
    return collections;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.categoryRepository.softDelete(id);
  }
}
