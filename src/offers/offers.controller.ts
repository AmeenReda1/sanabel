import { Controller, Get, Post, Body, Param, Delete, Headers } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Lang } from 'src/news/entities/news.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) { }

  @Post()
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get()
  findAll(@Headers('lang') lang: Lang) {
    return this.offersService.findAll(lang);
  }
  @Get(':id')
  findOne(@Headers('lang') lang: Lang,@Param('id') id:string) {
    return this.offersService.findOne(+id,lang);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offersService.remove(+id);
  }
}
