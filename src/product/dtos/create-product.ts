import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProductType } from '../enums/product-type.enum';
import { Type } from 'class-transformer';
import { CreateServiceDto } from 'src/service/dtos/create-service.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product Name' })
  @IsNotEmpty({ message: 'Product Name Required' })
  @IsString()
  name: string;
  @ApiProperty({ description: 'Product Type' })
  @IsNotEmpty({ message: 'Product Type Required' })
  @IsEnum(ProductType)
  type: ProductType;
  @ApiProperty({ description: 'Product Belong to Service' })
  @Type(() => CreateServiceDto)
  service: CreateServiceDto;
}
