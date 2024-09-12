import { Controller, Get, Post, Body, Headers, Param, Delete, Header, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { Lang } from './entities/news.entity';
import { RoleGuard } from 'src/common/gurads/permission.guard';
import { JwtAuthGuard } from 'src/user/guards/user-jwt.guard';
import { UserRole } from 'src/user/user.entity';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }
  @Role(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto); // business login
  }

  @Get()
  findAll(@Headers('lang') lang: Lang) {
    return this.newsService.findAll(lang);
  }
  @Get(':id')
  findOne(@Headers('id') lang: Lang,@Param('id') id:string) {
    return this.newsService.findOne(+id,lang);
  }

  @Role(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
