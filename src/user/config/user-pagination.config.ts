import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { User } from '../user.entity';

export const userPaginateConfig: PaginateConfig<User> = {
  sortableColumns: ['id', 'name'],
  defaultSortBy: [['name', 'DESC']],
  select: ['id', 'name'],
  maxLimit: 20,
  relativePath: true,
  filterableColumns: {
    name: [FilterOperator.EQ],
  },
};
