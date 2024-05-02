import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Company {
  @ApiProperty({ description: 'Company Id' })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ description: 'Company Name' })
  @Column({ unique: true })
  companyName: string;
  // comapny users
  @OneToMany(() => User, (user) => user.company)
  users: User[];
  @ApiProperty({
    description: 'Products Assigned To This Company',
    type: [Product],
    example: [
      { id: 1, name: 'first Product', type: 'Product Type' },
      { id: 2, name: 'Second Product', type: 'Product Type' },
    ],
  })
  @ManyToMany(() => Product, { eager: true })
  @JoinTable()
  has: Product[];
  //comapny owner
  // @ApiProperty({ description: 'Owner Of This Company', type: User })
  @OneToOne(() => User)
  @JoinColumn()
  owner: User;
}
