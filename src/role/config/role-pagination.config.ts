import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Role } from '../role.entity';

export const rolePaginateConfig: PaginateConfig<Role> = {
  sortableColumns: ['id', 'roleName'],
  defaultSortBy: [['roleName', 'DESC']],
  select: ['id', 'roleName'],
  maxLimit: 20,
  relativePath: true,
  filterableColumns: {
    roleName: [FilterOperator.EQ],
  },
};
