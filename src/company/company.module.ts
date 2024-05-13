import { Module, forwardRef } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';
import { JwtStrategy } from 'src/admin/strategies/admin-jwt.strategy';
import { PermissionsGuard } from 'src/common/gurads/permission.guard';
import { AdminJwtAuthGuard } from 'src/admin/guards/admin-jwt.guard';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, User, Product]),
    forwardRef(() => UserModule),
    AdminModule,
    UserModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService, JwtStrategy, PermissionsGuard, AdminJwtAuthGuard],
  exports: [CompanyService],
})
export class CompanyModule {}
