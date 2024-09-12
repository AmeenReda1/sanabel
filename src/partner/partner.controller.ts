import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PartenerService } from './partner.service';
import { CreatePartenerDto } from './dto/create-partener.dto';
import { RoleGuard } from 'src/common/gurads/permission.guard';
import { JwtAuthGuard } from 'src/user/guards/user-jwt.guard';
import { UserRole } from 'src/user/user.entity';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('partner')
export class PartenerController {
  constructor(private readonly partenerService: PartenerService) { }
  @Role(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  create(@Body() createPartenerDto: CreatePartenerDto) {
    console.log(createPartenerDto)
    return this.partenerService.create(createPartenerDto);
  }

  @Get()
  findAll() {
    return this.partenerService.findAll();
  }
  
  @Role(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partenerService.remove(+id);
  }
}
