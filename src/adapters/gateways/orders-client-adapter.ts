import { OrderDTO } from "../../base/dto/order";

export interface OrderClientAdapter {
    getById(idOrder: number): Promise<OrderDTO>
  }