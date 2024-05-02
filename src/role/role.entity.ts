import { ApiProperty } from '@nestjs/swagger';
import { Admin } from 'src/admin/admin.enitity';
import { AllRoles } from 'src/common/enums/admin.role.enum';
import { Permission } from 'src/permission/permission.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role {
  @ApiProperty({ description: 'Role Id' })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ description: 'Role Name' })
  @Column({ unique: true })
  roleName: AllRoles;
  @OneToMany(() => Admin, (admin) => admin.role)
  admin: Admin[];

  @OneToMany(() => User, (user) => user.role)
  user: User[];
  @ApiProperty({
    description: 'Role Id',
    type: [Permission],
    example: [
      { id: 1, name: 'Create_User' },
      { id: 2, name: 'Create_User' },
    ],
  })
  @ManyToMany(() => Permission, { eager: true })
  @JoinTable()
  permission: Permission[];
}
