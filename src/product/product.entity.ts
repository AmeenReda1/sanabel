import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductType } from './enums/product-type.enum';
import { Service } from 'src/service/service.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @ApiProperty({ description: 'Product Id' })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ description: 'Product Name' })
  @Column()
  name: string;
  @ApiProperty({ description: 'Product Type', enum: ProductType })
  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;
  @ApiProperty({ description: 'Product belongs To', type: Service })
  @ManyToOne(() => Service, (service) => service.product, { lazy: true })
  service: Service;
}
