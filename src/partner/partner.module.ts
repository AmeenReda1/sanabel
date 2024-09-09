import { Module } from '@nestjs/common';
import { PartenerService } from './partner.service';
import { PartenerController } from './partner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './entities/partner.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partner])
  ],
  controllers: [PartenerController],
  providers: [PartenerService],
})
export class PartenerModule { }
