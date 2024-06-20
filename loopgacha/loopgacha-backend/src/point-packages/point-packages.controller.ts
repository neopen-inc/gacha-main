import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Redirect,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { PointPackagesService } from './point-packages.service';
import { CreatePointPackageDto } from './dto/create-point-package.dto';
import { UpdatePointPackageDto } from './dto/update-point-package.dto';
import { ApiOperation } from '@nestjs/swagger';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from '../payment/payment.service';
import { PointTransactionsService } from '../point-transactions/point-transactions.service';
import { ListQueryOptionsDto } from '../dto/list-query-options.dto';
import { CreateBuyDto } from './dto/create-buy.dto';
import { StripeCallbackDto } from './dto/stripe-callback.dto';
import { Public } from '../auth/decorators/public.decorator';
import { RequireAdmin } from '../auth/decorators/admin.decorator';

@Controller('point-packages')
export class PointPackagesController {
  constructor(
    private readonly pointPackagesService: PointPackagesService,
    private configService: ConfigService,
    private paymentService: PaymentService,
    private pointTransactionsService: PointTransactionsService,
  ) {}

  @RequireAdmin()
  @Post()
  @ApiOperation({
    summary: 'PointPackageを作成',
    description: 'PointPackageはユーザー購入可能なポイント選択肢',
  })
  async create(@Body() createPointPackageDto: CreatePointPackageDto) {
    return this.pointPackagesService.create(createPointPackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'PointPackageを一覧' })
  async findAll(@Query() opts: ListQueryOptionsDto) {
    return this.pointPackagesService.findAll(opts);
  }

  @Get(':id')
  @ApiOperation({ summary: 'PointPackageをIDで取得' })
  async findOne(@Param('id') id: string) {
    return this.pointPackagesService.findOne(id);
  }

  @RequireAdmin()
  @Patch(':id')
  @ApiOperation({ summary: 'PointPackageを更新' })
  async update(
    @Param('id') id: string,
    @Body() updatePointPackageDto: UpdatePointPackageDto,
  ) {
    return this.pointPackagesService.update(id, updatePointPackageDto);
  }

  @RequireAdmin()
  @Delete(':id')
  @ApiOperation({ summary: 'PointPackageを削除' })
  async remove(@Param('id') id: string) {
    return this.pointPackagesService.remove(id);
  }

  @Public()
  @Get('checkout/success')
  @Redirect('http://localhost:3000/mypage')
  async success(@Query() { sessionId }: StripeCallbackDto) {
    const stripe = new Stripe(
      this.configService.get<string>('stripe.secretKey'),
      {
        apiVersion: '2022-11-15',
      },
    );
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.status !== 'complete') {
      throw new NotFoundException({
        message: 'payment not complete',
      });
    }
    const payment = await this.paymentService.findOneBy({
      sessionId,
      status: 'pending',
    });
    if (!payment) {
      throw new NotFoundException({
        message: 'payment not found',
      });
    }
    await this.paymentService.update(payment.id, {
      status: 'success',
    });
    const pointPackage = await this.pointPackagesService.findOne(
      payment.pointPackageId,
    );
    await this.pointTransactionsService.create(payment.userId, {
      type: 'stripe_charge',
      pointPackageId: payment.pointPackageId,
      amount: pointPackage.points,
      reason: 'charge',
    });
    return {
      url: `${this.configService.get<string>('website.domain')}/mypage`,
    };
  }
  @Post('checkout-session')
  async buy(@Body() body: CreateBuyDto) {
    const { packageId, userId } = body;
    const stripe = new Stripe(
      this.configService.get<string>('stripe.secretKey'),
      {
        apiVersion: '2022-11-15',
      },
    );
    const pointPackage = await this.pointPackagesService.findOne(packageId);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: pointPackage.providerPackageId,
          quantity: 1,
        },
      ],
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${this.configService.get<string>(
        'api.domain',
      )}/point-packages/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get<string>(
        'api.domain',
      )}/point-packages/checkout/cancel?sessionId={CHECKOUT_SESSION_ID}`,
    });
    await this.paymentService.create({
      sessionId: session.id,
      userId,
      pointPackageId: pointPackage.id,
      status: 'pending',
    });

    return { url: session.url };
  }
  @Public()
  @Get('checkout/cancel')
  @Redirect('http://localhost:3000/mypage')
  async cancel(@Query() query: StripeCallbackDto) {
    const stripe = new Stripe(
      this.configService.get<string>('stripe.secretKey'),
      {
        apiVersion: '2022-11-15',
      },
    );
    const session = await stripe.checkout.sessions.retrieve(query.sessionId);
    const payment = await this.paymentService.findOneBy({
      sessionId: query.sessionId,
      status: 'pending',
    });
    if (!payment) {
      throw new NotFoundException({
        message: 'payment not found',
      });
    }
    await this.paymentService.update(payment.id, {
      status: 'cancel',
    });
    return {
      url: `${this.configService.get<string>('website.domain')}/mypage`,
    };
  }
}
