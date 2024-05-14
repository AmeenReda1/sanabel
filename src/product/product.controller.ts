import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product';
import { Product } from './product.entity';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Permission } from '../common/decorators/permission.decorator';
import { AdminJwtAuthGuard } from 'src/admin/guards/admin-jwt.guard';
import { PermissionsGuard } from 'src/common/gurads/permission.guard';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Permission('reate_Product')
  @UseGuards(AdminJwtAuthGuard, PermissionsGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productService.create(createProductDto);
  }

  @ApiCreatedResponse({ description: 'Get All Products', type: [Product] })
  @Permission('Get_All_Product')
  @UseGuards(AdminJwtAuthGuard, PermissionsGuard)
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.productService.findAll(query);
  }
}
