import { OrderDTO } from "../../base/dto/order";

export interface OrderClientAdapter {
  updateStatus(idOrder: number, status: string): Promise<void>
}