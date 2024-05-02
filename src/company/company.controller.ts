import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UserService } from 'src/user/user.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Company } from './company.entity';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PermissionsGuard } from 'src/common/gurads/permission.guard';
import { Permission } from 'src/common/decorators/permission.decorator';
import { AdminJwtAuthGuard } from 'src/admin/guards/admin-jwt.guard';
@ApiTags('Comapny')
@Controller('company')
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private readonly userService: UserService,
  ) {}
  @ApiCreatedResponse({ description: 'Created Company', type: Company })
  @Permission('Create_Company')
  @UseGuards(AdminJwtAuthGuard, PermissionsGuard)
  @Post()
  async createCompany(@Body() createComapnyDto: CreateCompanyDto) {
    const { user, company } = createComapnyDto;
    console.log('inside create in company controller');
    const newComapny = await this.companyService.createCompany(company);
    if (!newComapny) {
      throw new ConflictException(`There is a company with the same Name`);
    }
    const companyOwner = await this.userService.createUser(user);
    const savedCompany = await this.companyService.assignOwnerToComapny(
      companyOwner,
      newComapny,
    );
    return savedCompany;
  }

  @ApiCreatedResponse({ description: 'Get All Companies', type: [Company] })
  @Get()
  async getAllCompanies(@Paginate() query: PaginateQuery) {
    return await this.companyService.findAll(query);
  }

  @ApiCreatedResponse({ description: 'Get All Companies', type: [Company] })
  // assign product to company
  @Permission('Assign_Product_Company')
  @UseGuards(AdminJwtAuthGuard, PermissionsGuard)
  @Post('assignProduct/:companyId')
  async assignProduct(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Body('productName') productName: string,
  ) {
    await this.companyService.assignProduct(companyId, productName);
  }
}
