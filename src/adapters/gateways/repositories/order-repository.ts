import { OrderDAO } from '../../../base/dao/order'

export interface OrderRepository {
  save(order: OrderDAO): Promise<OrderDAO>
  getById(orderId: number): Promise<OrderDAO | null>
  findByParams(status: string): Promise<OrderDAO[] | []> 
  getAll(): Promise<OrderDAO[] | []>
  update(orderId: number, status: string): Promise<void>
}
