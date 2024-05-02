import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Service } from '../service.entity';

export const servicePaginateConfig: PaginateConfig<Service> = {
  sortableColumns: ['id', 'name'],
  defaultSortBy: [['name', 'DESC']],
  select: ['id', 'name'],
  maxLimit: 20,
  relativePath: true,
  filterableColumns: {
    name: [FilterOperator.EQ],
  },
};
