import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserCheckinService } from './user-checkin.service';
import { CreateUserCheckinDto } from './dto/create-user-checkin.dto';
import { UpdateUserCheckinDto } from './dto/update-user-checkin.dto';
import { UserCheckinListQueryOptionsDto } from './dto/user-checkin-list-query-options.dto';
import { RequireAdmin } from '../auth/decorators/admin.decorator';

@Controller('user-checkin')
export class UserCheckinController {
  constructor(private readonly userCheckinService: UserCheckinService) {}

  @Post()
  create(@Body() createUserCheckinDto: CreateUserCheckinDto) {
    return this.userCheckinService.create(createUserCheckinDto);
  }
  @Get()
  findAll(@Query() query: UserCheckinListQueryOptionsDto) {
    return this.userCheckinService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCheckinService.findOne(id);
  }

  @RequireAdmin()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserCheckinDto: UpdateUserCheckinDto) {
    return this.userCheckinService.update(id, updateUserCheckinDto);
  }

  @RequireAdmin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCheckinService.remove(id);
  }
}
