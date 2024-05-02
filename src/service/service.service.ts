import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dtos/create-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { Service } from './service.entity';
import { Paginated, paginate } from 'nestjs-paginate';
import { servicePaginateConfig } from './config/service-pagination.config';
@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
  ) {}
  async createService(createServiceDto: CreateServiceDto): Promise<Service> {
    console.log(createServiceDto);
    const { name } = createServiceDto;
    const existingService = await this.serviceRepository.findOne({
      where: { name },
    });
    if (existingService) {
      throw new ConflictException(`This Service Already Exsists`);
    }
    const newService = this.serviceRepository.create(createServiceDto);
    return await this.serviceRepository.save(newService);
  }
  async findService(id: number): Promise<Service> {
    const exsistingService = await this.serviceRepository.findOne({
      where: { id },
    });
    if (!exsistingService) {
      throw new NotFoundException(`There Isn't Service With This Id ${id}`);
    }
    return exsistingService;
  }
  async findAll(query): Promise<Paginated<Service>> {
    return paginate(query, this.serviceRepository, servicePaginateConfig);
  }
}
