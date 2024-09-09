import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync } from 'fs';

@Injectable()
export class CustomerService {
  constructor(@InjectRepository(Customer) private customerRepository: Repository<Customer>) { }
  create(createCustomerDto: CreateCustomerDto) {
    return this.customerRepository.save(createCustomerDto)
  }

  findAll() {
    return this.customerRepository.find({ order: { created_at: 'DESC' } })
  }

  async remove(id: number) {
    const exisitingCustomer = await this.customerRepository.findOne({ where: { id } })
    if (!exisitingCustomer) throw new NotFoundException(`Customer With Id ${id} not found`);
    await this.customerRepository.remove(exisitingCustomer);
    return {message:'تم حذف العميل بنجاح'}

  }
}
