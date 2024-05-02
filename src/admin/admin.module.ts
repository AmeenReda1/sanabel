import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.enitity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from 'src/email/email.module';
import { AdminJwtAuthGuard } from './guards/admin-jwt.guard';
import { PermissionsGuard } from 'src/common/gurads/permission.guard';
import { JwtStrategy } from './strategies/admin-jwt.strategy';

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

    TypeOrmModule.forFeature([Admin]),
    PassportModule,
    EmailModule,
    JwtModule,
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
    AdminJwtAuthGuard,
    PermissionsGuard,
  ],
  exports: [AdminService],
})
export class AdminModule {}
