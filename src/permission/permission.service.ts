import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { Repository } from 'typeorm';
import { PermissionDto } from './dtos/permission.dto';
import { Paginated, paginate } from 'nestjs-paginate';
import { permissionPaginateConfig } from './config/permission-pagination.config';

@Injectable()
export class permissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(permissionDto: PermissionDto): Promise<Permission> {
    const { permission_name } = permissionDto;
    const permissionExists = await this.permissionRepository.find({
      where: { permission_name },
    });
    console.log();
    if (permissionExists.length > 0) {
      throw new ConflictException(
        `This permission ${permission_name} Already Exists`,
      );
    }
    const newpermission = await this.permissionRepository.create(permissionDto);
    return await this.permissionRepository.save(newpermission);
  }

  async findAll(query): Promise<Paginated<Permission>> {
    return paginate(query, this.permissionRepository, permissionPaginateConfig);
  }
}
