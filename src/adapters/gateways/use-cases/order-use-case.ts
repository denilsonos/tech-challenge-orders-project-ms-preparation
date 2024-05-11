import { OrderDTO } from "../../../base/dto/order";
import { OrderEntity } from "../../../core/entities/order";

export interface OrderUseCase {
    create(order: OrderDTO): Promise<OrderEntity>;
    findByParams(status?: string): Promise<OrderEntity[] | []>;
    update(order: OrderDTO, status: string): Promise<void>
}