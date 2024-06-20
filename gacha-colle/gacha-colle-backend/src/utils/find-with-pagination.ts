import { PaginatedResponse } from '../dto/paginated-response.dto';
import { FindOptionsSelect, FindOptionsSelectByString, Repository } from 'typeorm';

export function parseOrderBy(orderby: string) {
  return orderby.split(',').reduce((result, item) => {
    const [field, order] = item
      .trim()
      .split(' ')
      .map((item) => item.trim());
    result[field] = order;
    return result;
  }, {});
}
export async function findWithPagination<T>(
  repository: Repository<T>,
  {
    top = 10,
    skip = 0,
    where = {},
    relations = [],
    orderby = '',
    select = undefined,
  }: {
    top?: number;
    skip?: number;
    where?: any;
    relations?: string[];
    orderby?: string;
    select?: FindOptionsSelect<T>;
  },
): Promise<PaginatedResponse<T>> {
  const [result, total] = await repository.findAndCount({
    take: top,
    skip,
    where,
    relations,
    order: parseOrderBy(orderby),
    ...(select ? { select } : {}),
  });
  return {
    data: result,
    total,
    count: result.length,
    limit: top,
    offset: skip,
  };
}
