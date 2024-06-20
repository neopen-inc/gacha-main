import { dto } from '@common-utils';

export interface PostShippingDto {
  userId: string;
  addressId: string;
  lineItems: string[];
}

export interface PatchShippingDto {
  trackingNumber: string;
  status: string;
}

export interface GetShippingListQueryDto extends dto.GetListQueryDto {
  status?: 'waiting' | 'confirmed' | 'shipped' | 'delivered';
}
