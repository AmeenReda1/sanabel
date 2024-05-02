import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

import { Service } from './service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), AdminModule],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
