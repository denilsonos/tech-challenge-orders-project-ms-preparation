import { Order } from "../gateways/interfaces/order";
import { z } from "zod";
import { BadRequestException, ConflictException, NotFoundException } from "../../core/entities/exceptions";
import { OrderRepository } from "../gateways/repositories/order-repository";
import { OrderUseCase } from "../gateways/use-cases/order-use-case";
import { OrderRepositoryImpl } from "../repositories/order-repository";
import { OrderUseCaseImpl } from "../../core/use-cases/orders/order-use-case";
import { FakeQueueServiceAdapter } from "../external-services/fake-queue-service/fake-queue-service-adapter";
import { QueueServiceAdapter } from "../gateways/queue-service-adapter";
import { OrderDTO } from "../../base/dto/order";
import { OrderPresenter } from "../presenters/order";
import { OrderEntity } from "../../core/entities/order";
import { DbConnection } from "../gateways/db/db-connection";
import { OrderStatus } from "../../core/entities/enums/order-status";

export class OrderController implements Order {
  private orderUseCase: OrderUseCase;
  private orderRepository: OrderRepository;
  private queueService : QueueServiceAdapter

  constructor(readonly database: DbConnection) { 
    this.orderRepository = new OrderRepositoryImpl(database)
    this.queueService = new FakeQueueServiceAdapter(database)
    this.orderUseCase = new OrderUseCaseImpl(this.orderRepository, this.queueService)
  }

  async create(bodyParams: unknown): Promise<OrderDTO> {
    const schema = z.object({
      idOrder: z.string().min(1).refine(value => {
        const parsedNumber = Number(value);
        return !isNaN(parsedNumber);
      }, {
        message: 'Invalid number format',
      }),
      status: z.nativeEnum(OrderStatus),
      createdAt: z.coerce.date().optional(),
    })

    const result = schema.safeParse(bodyParams)

    if (!result.success) {
      throw new BadRequestException('Validation error!', result.error.issues)
    }

    const {idOrder, status, createdAt} = result.data
       
    const orderToCreate = new OrderDTO(Number(idOrder), status, createdAt!, new Date())
    const orderCreated = await this.orderUseCase.create(orderToCreate)   
    return OrderPresenter.EntityToDto(orderCreated)
  }

  async findByParams(bodyParams: unknown): Promise<OrderDTO[]> {
      const schema = z.object({
        status: z.nativeEnum(OrderStatus).optional(),
      })
  
      const result = schema.safeParse(bodyParams)
  
      if (!result.success) {
        throw new BadRequestException('Validation error!', result.error.issues)
      }

      const {status} = result.data  

      const orders: OrderEntity[] = await this.orderUseCase.findByParams(status)
      return OrderPresenter.EntitiesToDto(orders)
  }

  async update(bodyParams: any, params: unknown): Promise<void> {
    const schema = z.object({
      status: z.nativeEnum(OrderStatus),
    })

    const statusResult = schema.safeParse(bodyParams)
    const orderIdResult = this.validateId(params)

    if (!statusResult.success) {
      throw new BadRequestException('Validation error!', statusResult.error.issues)
    }

    if (statusResult.data.status == OrderStatus.Empty) {
      throw new BadRequestException('Validation error! Status must be a one of CREATED, PENDING_PAYMENT, RECEIVED, IN_PREPARATION, READY, FINISHED', undefined)
    }

    if (!orderIdResult.success) {
      throw new BadRequestException('Validation error!', orderIdResult.error.issues)
    }

    const order = await this.orderUseCase.getById(Number(orderIdResult.data.id))

    if(!order){
      throw new NotFoundException("Order not found!")
    }

    if (order.status == OrderStatus.Ready) {
      throw new ConflictException("Order is ready!")
    } 

    await this.orderUseCase.update(OrderPresenter.EntityToDto(order), statusResult.data.status)
  }

  private validateId(bodyParams: unknown){
    const schema = z.object({
      id: z.string().min(1).refine(value => {
        const parsedNumber = Number(value);
        return !isNaN(parsedNumber);
      }, {
        message: 'Invalid number format',
      })
    })
    return schema.safeParse(bodyParams)
  }
}