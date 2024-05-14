import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dtos/create-service.dto';
import { Service } from './service.entity';
import { ApiCreatedResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AdminJwtAuthGuard } from 'src/admin/guards/admin-jwt.guard';
import { Permission } from 'src/common/decorators/permission.decorator';
import { PermissionsGuard } from 'src/common/gurads/permission.guard';
@ApiTags('Service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
  @Permission('Create_Service')
  @UseGuards(AdminJwtAuthGuard, PermissionsGuard)
  @ApiProperty({ description: 'Create Service' })
  @ApiCreatedResponse({ type: Service })
  @Post()
  async create(@Body() createDto: CreateServiceDto): Promise<Service> {
    return await this.serviceService.create(createDto);
  }

  @Permission('Get_Specific_Service')
  @UseGuards(AdminJwtAuthGuard, PermissionsGuard)
  @ApiCreatedResponse({ type: Service })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Service> {
    return await this.serviceService.findOne(id);
  }

  @ApiCreatedResponse({ description: 'Get All Services', type: [Service] })
  @Permission('Get_All_Service')
  @UseGuards(AdminJwtAuthGuard, PermissionsGuard)
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.serviceService.findAll(query);
  }
}
