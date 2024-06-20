import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CheckinConfigService } from './checkin-config.service';
import { CreateCheckinConfigDto } from './dto/create-checkin-config.dto';
import { UpdateCheckinConfigDto } from './dto/update-checkin-config.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('checkin-config')
export class CheckinConfigController {
  constructor(private readonly checkinConfigService: CheckinConfigService) {}

  @Post()
  create(@Body() createCheckinConfigDto: CreateCheckinConfigDto) {
    return this.checkinConfigService.create(createCheckinConfigDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.checkinConfigService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkinConfigService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCheckinConfigDto: UpdateCheckinConfigDto,
  ) {
    return this.checkinConfigService.update(id, updateCheckinConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkinConfigService.remove(id);
  }
}
