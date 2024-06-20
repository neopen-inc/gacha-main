import { dto } from '@common-utils';

export interface GetPaymentsQueryDto extends dto.GetListQueryDto {
  userId?: string;
  pointPackageId?: string;
  status?: string;
}