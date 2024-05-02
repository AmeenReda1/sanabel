import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/role/role.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Admin {
  @ApiProperty({ description: 'Generated Id' })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ description: 'Admin Name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Admin Email' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Admin Hashed Password' })
  @Column()
  password: string;
  @ApiProperty({ description: 'Admin Token For Reset Password' })
  @Column({ default: '' })
  tokenId: string;
  @ApiProperty({ description: 'Admin Valid Time For Token' })
  @Column({ type: 'timestamp', nullable: true })
  tokenValid: Date;
  @ManyToOne(() => Role, (role) => role.admin, { eager: true })
  @ApiProperty({ enum: ['Super_Admin', 'Admin'] })
  role: Role;
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) this.password = await bcrypt.hash(this.password, 10);
  }
}
