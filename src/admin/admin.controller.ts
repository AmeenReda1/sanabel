import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Request,
  ParseUUIDPipe,
  Query,
  Get,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDto } from './dtos/admin.dto';
import { Admin } from './admin.enitity';
import { LocalAdminAuthGuard } from './guards/local-admin-auth.guard';
import { ResetPasswordDto } from 'src/common/dtos/reset-password.dto';
import { UUID } from 'crypto';
import { ForgetPasswordDto } from 'src/common/dtos/forget-password.dto';
import { AdminJwtAuthGuard } from './guards/admin-jwt.guard';
import { Permission } from 'src/common/decorators/permission.decorator';
import { PermissionsGuard } from 'src/common/gurads/permission.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @ApiCreatedResponse({
    description: 'created Admin As Response',
    type: Admin,
  })
  @ApiBadRequestResponse({ description: 'Cannot Create New Admin' })
  @Post()
  async create(@Body() adminDto: AdminDto): Promise<Admin> {
    console.log('------------------create-admin-controller----------------');
    return this.adminService.create(adminDto);
  }

  @ApiCreatedResponse({
    description: 'Login Admin As Response',
    schema: {
      example: {
        admin: {
          id: 1,
          username: 'admin1',
          email: 'admin1@example.com',
          password: 'hashedpasswprd',
          // Add other properties here as needed
        },
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized Admin Email Or Passowrd Not Correct',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com',
          description: 'The email of the user',
        },
        password: {
          type: 'string',
          example: 'password123',
          description: 'The password of the user',
        },
      },
    },
  })
  @UseGuards(LocalAdminAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log('admin login');
    return req.user;
  }

  @ApiNotFoundResponse({
    description: 'There Is No Admin With This Id ',
  })
  @ApiCreatedResponse({ description: 'Admin Deleted Sccussfully' })
  @ApiParam({ name: 'email', type: 'string' })
  @Permission('Delete_Admin')
  @UseGuards(AdminJwtAuthGuard, PermissionsGuard)
  @Delete(':email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('email') email: string) {
    console.log(email);

    return this.adminService.delete(email);
  }

  @ApiCreatedResponse({ description: '' })
  @Post('forgetPassword')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    await this.adminService.forgetPasword(forgetPasswordDto);
  }

  @ApiQuery({ name: 'token' })
  @Post('resetPassword')
  async resetPassowrd(
    @Query('token', ParseUUIDPipe) token: UUID,
    @Body() resetPassowrd: ResetPasswordDto,
  ) {
    const newPass = resetPassowrd.newPassword;
    console.log(newPass);
    console.log(token);
    return this.adminService.resetPassword(token, newPass);
  }

  @ApiResponse({
    status: 200,
    description: 'List of all admins',
    type: [Admin],
  })
  @Permission('Get_All_Admins')
  @UseGuards(AdminJwtAuthGuard, PermissionsGuard)
  @Get()
  async findAll(): Promise<Admin[]> {
    return await this.adminService.findAll();
  }
}
