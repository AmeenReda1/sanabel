import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { Lang } from 'src/news/entities/news.entity';

@Injectable()
export class OffersService {
  constructor(@InjectRepository(Offer) private offerRepository: Repository<Offer>) { }

  create(createOfferDto: CreateOfferDto) {
    return this.offerRepository.save(createOfferDto)
  }

  findAll(lang: Lang) {
    return this.offerRepository.find({ where: { lang }, order: { created_at: 'DESC' } })

  }
  findOne(id:number,lang: Lang) {
    return this.offerRepository.findOne({ where: { id,lang }, order: { created_at: 'DESC' } })

  }

  async remove(id: number) {
    const exisitingOffer = await this.offerRepository.findOne({ where: { id } })
    if (!exisitingOffer) throw new NotFoundException(`News With Id ${id} not found`);
    await this.offerRepository.remove(exisitingOffer);
    return { message: 'تم حذف العرض بنجاح' }
  }
}
