import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dtos/create-product';
import { Repository } from 'typeorm';
import { Service } from 'src/service/service.entity';
import { NOTFOUND } from 'dns';
import { productPaginateConfig } from './config/product-pagination.config';
import { Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { service, name } = createProductDto;
    const exsistingService = await this.serviceRepository.findOne({
      where: { name: service.name },
    });
    console.log(exsistingService);
    if (!exsistingService) {
      throw new NotFoundException(`There is No Service With This Name`);
    }
    const existingProduct = await this.productRepository.findOne({
      where: { name },
    });
    if (existingProduct) {
      throw new ConflictException(`This Product Already Exsists`);
    }
    const newProduct = this.productRepository.create(createProductDto);
    newProduct.service = exsistingService;
    return await this.productRepository.save(newProduct);
  }
  async findById(productId: number): Promise<Product> {
    const productExsist = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!productExsist) {
      throw new NotFoundException(
        `There is No Product With This Id ${productId}`,
      );
    }
    return productExsist;
  }
  async findAll(query): Promise<Paginated<Product>> {
    return paginate(query, this.productRepository, productPaginateConfig);
  }
}
