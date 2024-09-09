import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartenerDto } from './dto/create-partener.dto';
import { Partner } from './entities/partner.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PartenerService {
  constructor(@InjectRepository(Partner) private partnerRepository: Repository<Partner>) { }

  create(createPartenerDto: CreatePartenerDto) {
    return this.partnerRepository.save(createPartenerDto)
  }

  findAll() {
    return this.partnerRepository.find({ order: { created_at: 'DESC' } })

  }

  async remove(id: number) {
    const exisitingPartner = await this.partnerRepository.findOne({ where: { id } })
    if (!exisitingPartner) throw new NotFoundException(`News With Id ${id} not found`);
    await this.partnerRepository.remove(exisitingPartner);
    return { message: 'تم حذف الشريك بنجاح' }
  }
}
