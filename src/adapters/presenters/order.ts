import { OrderDTO } from "../../base/dto/order";
import { OrderEntity } from "../../core/entities/order";

export class OrderPresenter {

    static EntityToDto(orderEntity: OrderEntity): OrderDTO{
        return new OrderDTO(orderEntity.idOrder,
            orderEntity.status, 
            orderEntity.createdAt,
            orderEntity.updatedAt);
    }

    static EntitiesToDto(ordersEntities: OrderEntity[]): OrderDTO[] {
        
        const listDtos: OrderDTO[] = []; 

        ordersEntities.forEach(orderEntity => {
            listDtos.push(OrderPresenter.EntityToDto(orderEntity));
        });
        
        return listDtos;
    }
}