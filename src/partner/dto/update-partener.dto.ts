import { PartialType } from '@nestjs/swagger';
import { CreatePartenerDto } from './create-partener.dto';

export class UpdatePartenerDto extends PartialType(CreatePartenerDto) {}
