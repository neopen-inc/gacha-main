import { IsString } from 'class-validator';

export class StripeCallbackDto {
  @IsString()
  sessionId: string;
}
