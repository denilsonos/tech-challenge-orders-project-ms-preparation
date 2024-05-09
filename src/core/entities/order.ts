import  {FakeQueue } from "../../adapters/external-services/fake-queue-service/fake-queue-service-adapter"
export class OrderEntity {
  public id?: number

  public status!: string

  public createdAt!: Date;

  public updatedAt!: Date;

  public queue?: FakeQueue

  constructor(status: string, createdAt: Date, updatedAt: Date, id?: number) {
    this.status= status
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.id = id
  }
}
