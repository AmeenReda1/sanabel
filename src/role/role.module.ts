import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Permission } from 'src/permission/permission.entity';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), AdminModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
