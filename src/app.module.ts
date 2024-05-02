import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { APP_PIPE } from '@nestjs/core';
import { RoleModule } from './role/role.module';
import { permissionModule } from './permission/permission.module';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { ServiceModule } from './service/service.module';
import { ProductModule } from './product/product.module';
import { LoggerService } from './common/LoggerService';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
      expandVariables: true,
    }),
    AdminModule,
    DatabaseModule,
    RoleModule,
    permissionModule,
    CompanyModule,
    UserModule,
    EmailModule,
    ServiceModule,
    ProductModule,
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
