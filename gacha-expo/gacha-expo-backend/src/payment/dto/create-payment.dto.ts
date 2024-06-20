export class CreatePaymentDto {
  sessionId: string;
  userId: string;
  pointPackageId: string;
  status: 'pending' | 'cancel' | 'success';
}
