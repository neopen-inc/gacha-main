import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserCheckinService } from './user-checkin.service';
import { CreateUserCheckinDto } from './dto/create-user-checkin.dto';
import { UpdateUserCheckinDto } from './dto/update-user-checkin.dto';

@Controller('user-checkin')
export class UserCheckinController {
  constructor(private readonly userCheckinService: UserCheckinService) {}

  @Post()
  create(@Body() createUserCheckinDto: CreateUserCheckinDto) {
    return this.userCheckinService.create(createUserCheckinDto);
  }

  @Get()
  findAll() {
    return this.userCheckinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCheckinService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserCheckinDto: UpdateUserCheckinDto) {
    return this.userCheckinService.update(id, updateUserCheckinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCheckinService.remove(id);
  }
}
