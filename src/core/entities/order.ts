import  {FakeQueue } from "../../adapters/external-services/fake-queue-service/fake-queue-service-adapter"
export class OrderEntity {
  public idOrder!: number

  public status!: string

  public createdAt!: Date;

  public updatedAt!: Date;

  public queue?: FakeQueue

  constructor(idOrder: number, status: string, createdAt: Date, updatedAt: Date) {
    this.status= status
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.idOrder = idOrder
  }
}
