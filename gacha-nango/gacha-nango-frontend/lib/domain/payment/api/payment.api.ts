import { axiosInstance } from "@gacha-nango-app/util/axios";
import { Payment } from "../types/payment.type";
import { GetPaymentsQueryDto } from "../dto/payment.dto";
import { types } from "@common-utils";

export async function getPayments(options: GetPaymentsQueryDto): Promise<types.Paginated<Payment>> {
  return await axiosInstance.get<types.Paginated<Payment>>('/payment', { params: options }).then((res) => res.data);
}

export async function getPayment(id: string): Promise<Payment> {
  return await axiosInstance.get<Payment>(`/payment/${id}`).then((res) => res.data);
}

export async function getUserPayment(userId: string, options: GetPaymentsQueryDto): Promise<types.Paginated<Payment>> {
  return await axiosInstance.get<types.Paginated<Payment>>('/payment', { params: options }).then((res) => res.data);
}
