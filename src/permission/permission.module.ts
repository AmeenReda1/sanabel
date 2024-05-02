import { Module } from '@nestjs/common';
import { permissionController } from './permission.controller';
import { permissionService } from './permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), AdminModule],
  controllers: [permissionController],
  providers: [permissionService],
})
export class permissionModule {}
