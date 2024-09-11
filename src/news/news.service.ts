import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lang, News } from './entities/news.entity';

@Injectable()
export class NewsService {
  constructor(@InjectRepository(News) private newsRepository: Repository<News>) { }

  create(createNewsDto: CreateNewsDto) {
    return this.newsRepository.save(createNewsDto)
  }

  findAll(lang: Lang) {
    return this.newsRepository.find({ where: { lang }, order: { created_at: 'DESC' } })

  }
  findOne(id:number,lang: Lang) {
    return this.newsRepository.findOne({ where: { id,lang }, order: { created_at: 'DESC' } })

  }
  async remove(id: number) {
    const exisitingNews = await this.newsRepository.findOne({ where: { id } })
    if (!exisitingNews) throw new NotFoundException(`News With Id ${id} not found`);
    await this.newsRepository.remove(exisitingNews);
    return { message: 'تم حذف الخبر بنجاح' }

  }
}
