import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Permission } from '../permission.entity';

export const permissionPaginateConfig: PaginateConfig<Permission> = {
  sortableColumns: ['id', 'permission_name'],
  defaultSortBy: [['permission_name', 'DESC']],
  select: ['id', 'permission_name'],
  maxLimit: 20,
  relativePath: true,
  filterableColumns: {
    permission_name: [FilterOperator.EQ],
  },
};
