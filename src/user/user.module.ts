import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from 'src/role/role.module';
import { Role } from 'src/role/role.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/user-local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { JwtStrategy } from './strategies/user-jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PermissionsGuard } from 'src/common/gurads/permission.guard';
import { ProductModule } from 'src/product/product.module';
import { CompanyModule } from 'src/company/company.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: `${configService.getOrThrow<string>('JWT_SECRET')}`, // Replace with your own secret key
        signOptions: {
          expiresIn: `${configService.getOrThrow<string>('JWT_EXPIRE_In')}`,
        }, // Optional: Configure expiration time
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Role]),
    RoleModule,
    PassportModule,
    JwtModule,
    EmailModule,
    ProductModule,
    forwardRef(() => CompanyModule),
    AdminModule,
  ],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy, PermissionsGuard],
  exports: [UserService],
})
export class UserModule {}
