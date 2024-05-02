import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ description: 'Service Name' })
  @IsNotEmpty({ message: 'Service Name Is Required' })
  @IsString()
  name: string;
}
