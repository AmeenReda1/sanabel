import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { LoggerService } from './common/LoggerService';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { NewsModule } from './news/news.module';
import { OffersModule } from './offers/offers.module';
import { PartenerModule } from './partner/partner.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
      expandVariables: true,
    }),
    DatabaseModule,
    UserModule,
    CustomerModule,
    NewsModule,
    OffersModule,
    PartenerModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_PIPE, useClass: ValidationPipe },
    AppService,
    LoggerService,
  ],
  exports: [LoggerService],
})
export class AppModule {}
