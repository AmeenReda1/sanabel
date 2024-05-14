import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Company } from './company.entity';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { companyPaginateConfig } from './config/pagination.cofig';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepsitory: Repository<Company>,
    @InjectRepository(Product) private ProductRepository: Repository<Product>,
    private entityManager: EntityManager,
    private userService: UserService,
  ) {}

  async create(companyName: string): Promise<Company> {
    const companyExists = await this.companyRepsitory.findOne({
      where: { companyName },
    });
    console.log(companyExists);
    if (companyExists) {
      throw new ConflictException(`There is a Comapany With The Same Name`);
    }
    const newCompany = this.companyRepsitory.create({ companyName });
    return await this.companyRepsitory.save(newCompany);
  }

  async findOne(where: any): Promise<Company> {
    const companyExists = await this.companyRepsitory.findOne(where);
    console.log(companyExists);
    if (!companyExists) {
      throw new NotFoundException(`There isn't Company with this data`);
    }
    return companyExists;
  }
  async assignProduct(
    comapnyId: number,
    productName: string,
  ): Promise<Company> {
    const companyExists = await this.companyRepsitory.findOne({
      where: { id: comapnyId },
    });
    if (!companyExists) {
      throw new NotFoundException(
        `There isn't Company with this id ${comapnyId}`,
      );
    }
    const product = await this.ProductRepository.findOne({
      where: { name: productName },
    });
    const productExists = companyExists.has.includes(product);
    if (productExists) {
      throw new NotFoundException(`This Product is Already Exists`);
    }
    companyExists.has.push(product);
    return await this.companyRepsitory.save(companyExists);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Company>> {
    return paginate(query, this.companyRepsitory, companyPaginateConfig);
  }

  async createAndAssignOwner(createDto: CreateCompanyDto): Promise<Company> {
    const { user, company } = createDto;

    return await this.entityManager.transaction(async (entityManager) => {
      // Create company
      const companyName = company;
      console.log(companyName, 'lololol');
      const newCompany = this.companyRepsitory.create({ companyName });
      const savedCompany = await entityManager.save(newCompany);

      if (!savedCompany) {
        throw new ConflictException(`There is a company with the same Name`);
      }

      // Create user
      let companyOwner = await this.userService.createUser(user, true);
      companyOwner = await entityManager.save(companyOwner);
      // Assign company to user
      savedCompany.owner = companyOwner;
      await entityManager.save(savedCompany);
      return savedCompany;
    });
  }
}
