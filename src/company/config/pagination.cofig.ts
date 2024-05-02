import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Company } from '../company.entity';

export const companyPaginateConfig: PaginateConfig<Company> = {
  sortableColumns: ['id', 'companyName'],
  defaultSortBy: [['companyName', 'DESC']],
  select: ['id', 'companyName'],
  maxLimit: 20,
  relativePath: true,
  filterableColumns: {
    companyName: [FilterOperator.EQ],
  },
};
