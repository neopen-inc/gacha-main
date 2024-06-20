import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  Request,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LineItemsService } from '../line-items/line-items.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ListQueryOptionsDto } from '../dto/list-query-options.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from '../auth/decorators/public.decorator';
import { UserListQueryDto } from './dto/user-list-query.dto';
import { AllowInactive } from '../auth/decorators/allow-inactive.decorator';
import { RequireAdmin } from '../auth/decorators/admin.decorator';
import { AddressesService } from '../addresses/addresses.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly lineItemService: LineItemsService,
    private readonly addressesService: AddressesService,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'ユーザーを作成' })
  @ApiBody({ type: CreateUserDto })
  async create(@Req() request, @Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, request.clientIp as string);
  }

  @RequireAdmin()
  @Get()
  @ApiOperation({ summary: 'ユーザーを一覧' })
  @ApiQuery({ type: ListQueryOptionsDto })
  async findAll(@Query() options: UserListQueryDto) {
    return this.usersService.findAll(options);
  }

  @Get(':id')
  @AllowInactive()
  @ApiOperation({ summary: 'IDでユーザーを取得' })
  @ApiParam({ name: 'id', type: String, description: 'ユーザーID' })
  async findOne(@Request() req, @Param('id') id: string) {
    if (req.user.type !== 'admin' && id !== req.user.id) {
      throw new ForbiddenException('権限が足りない');
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'ユーザー情報を更新' })
  @ApiParam({ name: 'id', type: String, description: 'ユーザーID' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (req.user.type !== 'admin' && id !== req.user.id) {
      throw new ForbiddenException('権限が足りない');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @RequireAdmin()
  @Delete(':id')
  @ApiOperation({ summary: 'ユーザーを削除' })
  @ApiParam({ name: 'id', type: String, description: 'ユーザーID' })
  async remove(@Request() req, @Param('id') id: string) {
    if (req.user.type !== 'admin') {
      throw new ForbiddenException('権限が足りない');
    }
    return this.usersService.remove(id);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassowrd(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

  @Public()
  @Post('send-reset-password-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendResetPasswordEmail(@Body('email') email: string) {
    return this.usersService.sendResetPasswordEmail(email);
  }

  @Public()
  @Post(':id/verify-email')
  async verifyEmail(@Param('id') id: string, @Body('token') token: string) {
    return this.usersService.verifyEmail(id, token);
  }

  @Public()
  @Post(':id/send-verification-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendVerificationEmail(@Param('id') id: string) {
    return this.usersService.sendVerificationEmail(id);
  }

  @Get(':id/line-items')
  @ApiOperation({ summary: 'ユーザーのガチャしたアイテムを取得' })
  @ApiQuery({ type: ListQueryOptionsDto })
  @ApiParam({ name: 'id', type: String, description: 'ユーザーID' })
  async getLineItems(
    @Request() req,
    @Param('id') userId: string,
    @Query() { top, skip, orderby },
  ) {
    if (req.user.type !== 'admin' && userId !== req.user.id) {
      throw new ForbiddenException('権限が足りない');
    }
    return this.lineItemService.findByUserId(userId, {
      top: +top || 10,
      skip: +skip || 0,
      orderby,
    });
  }
}
