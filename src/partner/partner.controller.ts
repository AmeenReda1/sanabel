import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PartenerService } from './partner.service';
import { CreatePartenerDto } from './dto/create-partener.dto';

@Controller('partner')
export class PartenerController {
  constructor(private readonly partenerService: PartenerService) { }

  @Post()
  create(@Body() createPartenerDto: CreatePartenerDto) {
    console.log(createPartenerDto)
    return this.partenerService.create(createPartenerDto);
  }

  @Get()
  findAll() {
    return this.partenerService.findAll();
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partenerService.remove(+id);
  }
}
