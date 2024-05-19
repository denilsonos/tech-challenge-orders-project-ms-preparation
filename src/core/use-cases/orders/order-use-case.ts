import { OrderClientAdapter } from "../../../adapters/gateways/orders-client-adapter";
import { QueueServiceAdapter } from "../../../adapters/gateways/queue-service-adapter";
import { OrderRepository } from "../../../adapters/gateways/repositories/order-repository";
import { OrderUseCase } from "../../../adapters/gateways/use-cases/order-use-case";
import { OrderPresenter } from "../../../adapters/presenters/order";
import { OrderDAO } from "../../../base/dao/order";
import { OrderDTO } from "../../../base/dto/order";
import { OrderStatus } from "../../entities/enums/order-status";
import { AlreadyExistsException, NotFoundException } from "../../entities/exceptions";
import { OrderEntity } from "../../entities/order";

export class OrderUseCaseImpl implements OrderUseCase {

    constructor(private readonly orderRepository: OrderRepository,
        private readonly queueService: QueueServiceAdapter,
        private readonly orderClient: OrderClientAdapter) { }

    async create(order: OrderDTO): Promise<any> {
        const orderDAO = new OrderDAO()
        orderDAO.idOrder = order.idOrder
        orderDAO.status = order.status
        orderDAO.createdAt = order.createdAt
        orderDAO.updatedAt = order.updatedAt

        const orderFound: OrderDAO | null = await this.orderRepository.getById(orderDAO.idOrder)
        if (!orderFound?.idOrder) {
            const orderSaved = await this.orderRepository.save(orderDAO)
            await this.queueService.toqueue(order)
            return OrderDAO.daoToEntity(orderSaved);
        } else {
            throw new AlreadyExistsException('Order ID already registered')
        }
    }

    async findByParams(status: string): Promise<[] | OrderEntity[]> {
        let order: OrderDAO[] = (status == OrderStatus.Empty) ?
            await this.orderRepository.getAll() :
            await this.orderRepository.findByParams(status)

        return OrderDAO.daosToEntities(order)
    }

    async update(order: OrderDTO, status: string): Promise<void> {
        console.log("chegou aqui - inicio update")
        await this.queueService.dequeue(order)
        console.log("chegou aqui - queue")
        await this.orderRepository.update(order.idOrder!, status)
        console.log("chegou aqui - chamada update status repo")
        await this.orderClient.updateStatus(order.idOrder, order.status)
        console.log("chegou aqui - chamada update status client")
    }

    async getById(orderId: number): Promise<OrderEntity | null> {
        const order: OrderDAO | null = await this.orderRepository.getById(orderId)
        if (!order?.idOrder) {
            throw new NotFoundException('Order not found!')
        }

        return OrderDAO.daoToEntity(order)
    }
}