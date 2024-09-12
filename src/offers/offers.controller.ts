import { Controller, Get, Post, Body, Param, Delete, Headers, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Lang } from 'src/news/entities/news.entity';
import { JwtAuthGuard } from 'src/user/guards/user-jwt.guard';
import { RoleGuard } from 'src/common/gurads/permission.guard';
import { Role } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/user/user.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) { }

  @Role(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get()
  findAll(@Headers('lang') lang: Lang) {
    return this.offersService.findAll(lang);
  }
  @Get(':id')
  findOne(@Headers('lang') lang: Lang, @Param('id') id: string) {
    return this.offersService.findOne(+id, lang);
  }
  @Role(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offersService.remove(+id);
  }
}
