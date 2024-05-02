import { Company } from 'src/company/company.entity';
import { Role } from 'src/role/role.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Product } from 'src/product/product.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class User {
  @ApiProperty({ description: 'User Id' })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ description: 'User Name' })
  @Column()
  name: string;
  @ApiProperty({ description: 'User Email' })
  @Column({ unique: true })
  email: string;
  @ApiProperty({ description: 'User Password' })
  @Column()
  password: string;
  @ApiProperty({ description: 'User Token' })
  @Column({ default: '' })
  tokenId: string;
  @ApiProperty({ description: 'User Token valid For Specific Time' })
  @Column({ type: 'timestamp', nullable: true })
  tokenValid: Date;

  @ApiProperty({ description: 'User Products' })
  @ManyToMany(() => Product, { eager: true })
  @JoinTable()
  has: Product[];
  @ApiProperty({ enum: ['Company_Owner', 'Company_User'] })
  @ManyToOne(() => Role, (role) => role.roleName, { eager: true })
  role: Role;
  @ApiProperty({ description: 'User Company' })
  @ManyToOne(() => Company, (company) => company.users, { eager: true })
  company: Company;
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) this.password = await bcrypt.hash(this.password, 10);
  }
}
