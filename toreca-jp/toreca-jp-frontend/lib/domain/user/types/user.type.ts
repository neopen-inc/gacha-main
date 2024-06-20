export interface User {
  id: string;
  email: string;
  name: string;
  status: string;
  points: string;
  defaultAddress?: UserAddress;
  defaultAddressId?: string;
  type: 'normal' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAddress {
  id: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  user?: User;
  addressline1: string;
  addressline2: string;
  addressline3?: string;
  postcode: string;
  description?: string;
  phoneNumber: string;
}
