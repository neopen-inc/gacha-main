import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { CollectionsModule } from './collections/collections.module';
import { CardsModule } from './cards/cards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesModule } from './addresses/addresses.module';
import { PointPackagesModule } from './point-packages/point-packages.module';
import { PointTransactionsModule } from './point-transactions/point-transactions.module';
import { ShippingsModule } from './shippings/shippings.module';
import { LineItemsModule } from './line-items/line-items.module';
import { GachaModule } from './gacha/gacha.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CollectionCourseModule } from './collection-course/collection-course.module';
import { UserCheckinModule } from './user-checkin/user-checkin.module';
import { TokenModule } from './token/token.module';
import { UploadModule } from './upload/upload.module';
import { StripeModule } from './stripe/stripe.module';
import { PaymentModule } from './payment/payment.module';
import { SceneModule } from './scene/scene.module';
import { CheckinConfigModule } from './checkin-config/checkin-config.module';
import configuration from './config/configuration';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
      max: 100,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: 3306,
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        synchronize: false,
        autoLoadEntities: true,
        logging: 'all',
      }),
      inject: [ConfigService],
    }),
    CategoriesModule,
    UsersModule,
    CollectionsModule,
    CardsModule,
    AddressesModule,
    PointPackagesModule,
    PointTransactionsModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({        
        type: 'single',
        url: configService.get<string>('redis.url'),
      }),
      inject: [ConfigService],
    }),
    ShippingsModule,
    LineItemsModule,
    GachaModule,
    AuthModule,
    CollectionCourseModule,
    UserCheckinModule,
    TokenModule,
    UploadModule,
    StripeModule,
    PaymentModule,
    SceneModule,
    CheckinConfigModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
