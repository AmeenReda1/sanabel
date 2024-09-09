
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { UpsertType } from 'typeorm/driver/types/UpsertType';

export enum UserRole {
  ADMIN = 'admin'
}
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
  @Column({ type: 'enum',enum:UserRole,default:UserRole.ADMIN })
  type: UserRole
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) this.password = await bcrypt.hash(this.password, 10);
  }
}
