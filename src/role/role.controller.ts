import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './role.entity';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AdminJwtAuthGuard } from 'src/admin/guards/admin-jwt.guard';
import { PermissionsGuard } from 'src/common/gurads/permission.guard';
import { Permission } from 'src/common/decorators/permission.decorator';
@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Permission('Assign_Permission_To_Role')
  @UseGuards(AdminJwtAuthGuard, PermissionsGuard)
  @Post('assign/:roleId')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        permissionId: {
          type: 'number',
          example: 1,
          description: 'Product ID',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: Role,
    description: 'Permission Assigned To this Role',
  })
  async assignPermission(
    @Param('roleId') roleId: number,
    @Body('permissionId') permissionId: number,
  ) {
    console.log(roleId, permissionId);
    return this.roleService.assignPermission(roleId, permissionId);
  }
  @ApiCreatedResponse({ description: 'Get All Roles', type: [Role] })
  @Permission('Get_All_Role')
  @UseGuards(AdminJwtAuthGuard, PermissionsGuard)
  @Get()
  async getAllRoles(@Paginate() query: PaginateQuery) {
    return await this.roleService.findAll(query);
  }
}
