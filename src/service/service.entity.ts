import { ApiProduces, ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Service {
  @ApiProperty({ description: 'Service Id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Service Name' })
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Product, (product) => product.service, { eager: true })
  product: Product[];
}
