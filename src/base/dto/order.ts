import { FakeQueue } from "../../adapters/external-services/fake-queue-service/fake-queue-service-adapter";
import { OrderEntity } from "../../core/entities/order";

export class OrderDTO {
  public idOrder!: number

  public status!: string

  public createdAt!: Date;

  public updatedAt!: Date;

  public queue?: FakeQueue

  constructor(idOrder: number, status: string, createdAt: Date, updatedAt: Date) { 
    this.idOrder = idOrder
    this.status = status
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  public fromEntity(): OrderEntity {
    
    const order = new OrderEntity(
      this.idOrder,
      this.status,
      this.createdAt,
      this.updatedAt, 
      
    )
    return order
  }
}