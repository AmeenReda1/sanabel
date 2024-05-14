import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PermissionDto } from './dtos/permission.dto';
import { permissionService } from './permission.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Permission } from './permission.entity';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { LoggerService } from 'src/common/LoggerService';
import { Permission as PermissionDecorator } from '../common/decorators/permission.decorator';
import { AdminJwtAuthGuard } from 'src/admin/guards/admin-jwt.guard';
import { PermissionsGuard } from 'src/common/gurads/permission.guard';
@ApiTags('Permission')
@Controller('permission')
export class permissionController {
  constructor(private readonly permissionService: permissionService) {}

  @PermissionDecorator('Create_Permission')
  @UseGuards(AdminJwtAuthGuard, PermissionsGuard)
  @Post()
  async create(@Body() permissionDto: PermissionDto) {
    return await this.permissionService.create(permissionDto);
  }

  @ApiCreatedResponse({
    description: 'Get All Permissions',
    type: [Permission],
  })
  @PermissionDecorator('Get_Permissinos')
  @UseGuards(AdminJwtAuthGuard, PermissionsGuard)
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const logger = new LoggerService();
    const log = logger.consoleLogger();
    log.warn('try this warn logger');
    return await this.permissionService.findAll(query);
  }
}
