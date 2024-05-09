import { FakeQueue } from "../../adapters/external-services/fake-queue-service/fake-queue-service-adapter";
import { OrderEntity } from "../../core/entities/order";

export class OrderDTO {
  public id?: number

  public status!: string

  public createdAt!: Date;

  public updatedAt!: Date;

  public queue?: FakeQueue

  constructor(id?: number, status: string, createdAt: Date, updatedAt: Date) { 
    this.id = id
    this.status = status
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  public fromEntity(): OrderEntity {
    
    const order = new OrderEntity(
      this.status,
      this.createdAt,
      this.updatedAt, 
      this.id
    )
    return order
  }
}