import { Controller, Get, Post, Body, Headers, Param, Delete, Header } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { Lang } from './entities/news.entity';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

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


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
