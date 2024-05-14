import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { when } from 'joi';
import { Permission } from 'src/permission/permission.entity';
import { PermissionDto } from './dtos/role.dto';
import { Paginated, paginate } from 'nestjs-paginate';
import { rolePaginateConfig } from './config/role-pagination.config';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async assignPermission(roleId: number, permissionId: number): Promise<Role> {
    const roleExists = await this.roleRepository.findOne({
      where: { id: roleId },
    });
    if (!roleExists) {
      throw new NotFoundException(`There isn't role with this id ${roleId}`);
    }
    console.log('permissionId: ', permissionId);
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    console.log('permission: ', permission);
    console.log('rolexists: ', roleExists.permission);
    const permissionExists = roleExists.permission.includes(permission);
    console.log(permissionExists);
    if (permissionExists) {
      throw new NotFoundException(`This Permison is Already Exists`);
    }
    roleExists.permission.push(permission);
    return await this.roleRepository.save(roleExists);
  }

  async findOne(where: any): Promise<Role> {
    const roleExists = await this.roleRepository.findOne(where);
    console.log(roleExists);
    if (!roleExists) {
      throw new NotFoundException(`There isn't role with this data`);
    }
    return roleExists;
  }
  
  async findAll(query): Promise<Paginated<Role>> {
    return paginate(query, this.roleRepository, rolePaginateConfig);
  }
}
