import {
  Body,
  Controller,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
  Req,
  NotFoundException,
  Patch,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-userdto';
import { AuthGuard } from '@nestjs/passport';
import { ForgetPasswordDto } from '../common/dtos/forget-password.dto';
import { UUID } from 'crypto';
import { ResetPasswordDto } from '../common/dtos/reset-password.dto';
import { JwtAuthGuard } from './guards/user-jwt.guard';
import { Permission } from 'src/common/decorators/permission.decorator';
import { PermissionsGuard } from 'src/common/gurads/permission.guard';
import { Company } from 'src/company/company.entity';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './user.entity';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AdminJwtAuthGuard } from 'src/admin/guards/admin-jwt.guard';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiCreatedResponse({
    description: 'created User As Response',
    type: User,
  })
  @Post()
  async CreateUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    if (user) {
      return user;
    }
  }
  @ApiCreatedResponse({
    description: 'Login User As Response',
    schema: {
      example: {
        admin: {
          id: 1,
          username: 'user1',
          email: 'user@example.com',
          password: 'hashedpasswprd',
          // Add other properties here as needed
        },
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized User Email Or Passowrd Not Correct',
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
  @UseGuards(AuthGuard('local-user'))
  @Post('login')
  login(@Request() req) {
    return req.user;
  }
  @Post('forgetPassword')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    console.log('from forget pass');
    await this.userService.forgetPasword(forgetPasswordDto);
  }
  @Post('resetPassword')
  async resetPassowrd(
    @Query('token', ParseUUIDPipe) token: UUID,
    @Body() resetPassowrd: ResetPasswordDto,
  ) {
    const newPass = resetPassowrd.newPassword;
    console.log(newPass);
    console.log(token);
    return this.userService.resetPassword(token, newPass);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: {
          type: 'number',
          example: 1,
          description: 'Product ID',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'User With Assigned Products',
    type: User,
  })
  @Permission('Assign_Product_To_User')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch('assignToProduct/:userId')
  async assignProductToUser(
    @Request() request,
    @Param('userId', ParseIntPipe) userId: number,
    @Body('productId', ParseIntPipe) productId: number,
  ) {
    console.log('Assign_Product_To_User');
    console.log('test assign product to user ');
    const company = request.user.company;
    console.log('company comapny', company);
    if (!company) {
      throw new NotFoundException(`There Isn't Company For This Logged User`);
    }
    return await this.userService.assignProductToUser(
      company,
      userId,
      productId,
    );
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        companyId: {
          type: 'number',
          example: 1,
          description: 'Company ID',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'User With Assigned Company ',
    type: User,
  })
  // company owner can assign user to his company
  @Permission('Assign_Company_To_User')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch('assignToCompany/:userId')
  async assignCompanyToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req,
  ) {
    console.log('from add company route');
    const company: Company = req.user.company;
    console.log(typeof req.user.comapny);
    await this.userService.assignCompanyToUser(userId, company);
  }

  @ApiCreatedResponse({ description: 'Get All Users', type: [User] })
  @Permission('Get_All_Users')
  @UseGuards(AdminJwtAuthGuard, PermissionsGuard)
  @Get()
  async getAllUsers(@Paginate() query: PaginateQuery) {
    return await this.userService.findAll(query);
  }
}
