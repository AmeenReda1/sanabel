import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Product } from '../product.entity';

export const productPaginateConfig: PaginateConfig<Product> = {
  sortableColumns: ['id', 'name'],
  defaultSortBy: [['name', 'DESC']],
  select: ['id', 'name'],
  maxLimit: 20,
  relativePath: true,
  filterableColumns: {
    name: [FilterOperator.EQ],
  },
};
