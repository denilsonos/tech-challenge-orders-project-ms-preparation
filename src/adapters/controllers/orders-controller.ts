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
import { ItemUseCaseImpl } from "../../core/use-cases/item/item-use-case";
import { ItemRepositoryImpl } from "../repositories/item-repository";
import { ItemRepository } from "../gateways/repositories/item-repository";
import { ItemUseCase } from "../gateways/use-cases/item-use-case";
import { ItemPresenter } from "../presenters/item";
import { OrderPresenter } from "../presenters/order";
import { OrderEntity } from "../../core/entities/order";
import { DbConnection } from "../gateways/db/db-connection";
import { ItemOrderDTO } from "../../base/dto/item";
import { OrderStatus } from "../../core/entities/enums/order-status";

export class OrderController implements Order {
  private orderUseCase: OrderUseCase;
  private orderRepository: OrderRepository;
  private itemRepository: ItemRepository
  private itemUseCase : ItemUseCase
  private queueService : QueueServiceAdapter

  constructor(readonly database: DbConnection) { 
    this.orderRepository = new OrderRepositoryImpl(database)
    this.queueService = new FakeQueueServiceAdapter(database)
    this.itemRepository = new ItemRepositoryImpl(database)
    this.itemUseCase = new ItemUseCaseImpl(this.itemRepository)
    this.orderUseCase = new OrderUseCaseImpl(this.orderRepository, this.queueService)
  }

  async create(bodyParams: unknown): Promise<OrderDTO> {
    const schema = z.object({
      items: z
        .array(
          z.object({
            itemId: z.number(),
            quantity: z.number(),
          }),
        )
        .nonempty(),
      clientId: z.number().optional(),
    })

    const result = schema.safeParse(bodyParams)

    if (!result.success) {
      throw new BadRequestException('Validation error!', result.error.issues)
    }

    const now = new Date()
    const {items, clientId} = result.data
    const itemFormatted = this.getItems(items)
    const itemsOrder = await this.itemUseCase.getAllByIds(itemFormatted)
    
    const orderToCreate = new OrderDTO(OrderStatus.Created, clientId, now, now,
       ItemPresenter.EntitiesToDto(itemsOrder))
    
    const orderCreated = await this.orderUseCase.create(orderToCreate)   
    return OrderPresenter.EntityToDto(orderCreated)
  }

  async findByParams(bodyParams: unknown): Promise<OrderDTO[]> {
    const schema = z.object({
      clientId: z.string().min(1).refine(value => {
        const parsedNumber = Number(value);
        return !isNaN(parsedNumber);
      }, {
        message: 'Invalid number format',
      }).optional(),
      status: z.nativeEnum(OrderStatus).optional(),
    })

    const result = schema.safeParse(bodyParams)

    if (!result.success) {
      throw new BadRequestException('Validation error!', result.error.issues)
    }

    const clientId = result.data.clientId ? Number(result.data.clientId) : undefined
    const status = result.data.status

    const orders: OrderEntity[] = await this.orderUseCase.findByParams(clientId, status)
    return OrderPresenter.EntitiesToDto(orders)
  }

  async get(identifier: any): Promise<OrderDTO> {
    const result = this.validateId(identifier)

    if (!result.success) {
      throw new BadRequestException('Validation error!', result.error.issues)
    }

    const order = await this.orderUseCase.getById(Number(result.data.id))
    if(!order){
      throw new NotFoundException("Order not found!")
    }

    return OrderPresenter.EntityToDto(order)
  }

  async update(bodyParams: any, params: unknown): Promise<void> {
    const schema = z.object({
      status: z.enum([OrderStatus.Finished]),
    })

    const statusResult = schema.safeParse(bodyParams)
    const orderIdResult = this.validateId(params)

    if (!statusResult.success) {
      throw new BadRequestException('Validation error!', statusResult.error.issues)
    }

    if (!orderIdResult.success) {
      throw new BadRequestException('Validation error!', orderIdResult.error.issues)
    }

    const order = await this.orderUseCase.getById(Number(orderIdResult.data.id))

    if(!order){
      throw new NotFoundException("Order not found!")
    }

    if (order.status !== OrderStatus.Ready) {
      throw new ConflictException("Order is ready!")
    }

    await this.orderUseCase.update(OrderPresenter.EntityToDto(order), statusResult.data.status)
  }

  private getItems(items: any[]){
    const listItemIds: ItemOrderDTO[] = [];

    items.forEach(item => {
      listItemIds.push(new ItemOrderDTO(item.itemId, item.quantity))
    });

    return listItemIds
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