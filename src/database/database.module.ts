import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/admin/admin.enitity';
import { Company } from 'src/company/company.entity';
import { Permission } from 'src/permission/permission.entity';
import { Product } from 'src/product/product.entity';
import { Role } from 'src/role/role.entity';
import { Service } from 'src/service/service.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [Admin, Role, Permission, Company, User, Product, Service],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
