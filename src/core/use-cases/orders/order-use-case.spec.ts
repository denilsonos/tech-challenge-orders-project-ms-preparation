import { FakeQueue } from "../../../adapters/external-services/fake-queue-service/fake-queue-service-adapter";
import { OrderClientAdapter } from "../../../adapters/gateways/orders-client-adapter";
import { QueueServiceAdapter } from "../../../adapters/gateways/queue-service-adapter";
import { OrderRepository } from "../../../adapters/gateways/repositories/order-repository";
import { OrderDAO } from "../../../base/dao/order";
import { OrderDTO } from "../../../base/dto/order";
import { OrderStatus } from "../../entities/enums/order-status";
import { AlreadyExistsException } from "../../entities/exceptions";
import { OrderUseCaseImpl } from "./order-use-case";

const orderRepositorySpy: jest.Mocked<OrderRepository> = {
  save: jest.fn(),
  getById: jest.fn(),
  findByParams: jest.fn(),
  getAll: jest.fn(),
  update: jest.fn(),
}

const queueServiceAdapterSpy: jest.Mocked<QueueServiceAdapter> = {
  toqueue: jest.fn(),
  dequeue: jest.fn(),
}

const orderClientAdapterSpy: jest.Mocked<OrderClientAdapter> = {
  updateStatus: jest.fn(),
}

const mockOrderDao: OrderDAO = {
  idOrder: 1,
  status: OrderStatus.Created,
  createdAt: new Date(),
  updatedAt: new Date(),
  queue: new FakeQueue()
}

const mockOrderDTO = new OrderDTO(
  Number(1),
  OrderStatus.Created,
  new Date(),
  new Date())

const sut = new OrderUseCaseImpl(orderRepositorySpy, queueServiceAdapterSpy, orderClientAdapterSpy)

describe('Order use case methods', () => {
  describe('create', () => {

    it('must successfully create an order', async () => {
      //Arrange
      orderRepositorySpy.getById.mockResolvedValue(null)
      orderRepositorySpy.save.mockResolvedValue(mockOrderDTO)

      //Act
      await expect(sut.create(mockOrderDTO)).resolves.not.toThrow()

      //Assert
      expect(orderRepositorySpy.getById).toHaveBeenCalled()
      expect(orderRepositorySpy.save).toHaveBeenCalled()
    })

    it('order already exists', async () => {
      //Arrange
      orderRepositorySpy.getById.mockResolvedValue(mockOrderDao)

      //Act
      await expect(sut.create(mockOrderDTO)).rejects.
        toThrow(AlreadyExistsException)

      //Assert
      expect(orderRepositorySpy.getById).toHaveBeenCalled()
    })
  })

  describe('findByParams', () => {

    it('should find all orders by status empty', async () => {
      //Arrange
      orderRepositorySpy.getAll.mockResolvedValue([mockOrderDao])

      //Act
      await expect(sut.findByParams(OrderStatus.Empty)).resolves.not.toThrow()

      //Assert
      expect(orderRepositorySpy.getAll).toHaveBeenCalled()
    })

    it('should find empty array by status empty', async () => {
      //Arrange
      orderRepositorySpy.getAll.mockResolvedValue([])

      //Act
      await expect(sut.findByParams(OrderStatus.Empty)).resolves.not.toThrow()

      //Assert
      expect(orderRepositorySpy.getAll).toHaveBeenCalled()
    })

    it('should find orders by params', async () => {
      //Arrange
      orderRepositorySpy.findByParams.mockResolvedValue([mockOrderDao])

      //Act
      await expect(sut.findByParams(OrderStatus.Created)).resolves.not.toThrow()

      //Assert
      expect(orderRepositorySpy.findByParams).toHaveBeenCalled()
    })

    it('should find empty array by params', async () => {
      //Arrange
      orderRepositorySpy.findByParams.mockResolvedValue([])

      //Act
      await expect(sut.findByParams(OrderStatus.Created)).resolves.not.toThrow()

      //Assert
      expect(orderRepositorySpy.findByParams).toHaveBeenCalled()
    })
  })

  describe('update', () => {

    it('must successfully update an order', async () => {
      //Arrange
      orderClientAdapterSpy.updateStatus.mockResolvedValue()
      queueServiceAdapterSpy.dequeue.mockResolvedValue()
      orderRepositorySpy.update.mockResolvedValue()

      //Act
      await expect(sut.update(mockOrderDTO, OrderStatus.Created)).resolves.not.toThrow()

      //Assert
      expect(orderRepositorySpy.update).toHaveBeenCalled()
      expect(orderClientAdapterSpy.updateStatus).toHaveBeenCalled()
      expect(orderRepositorySpy.update).toHaveBeenCalled()
    })
  })

  describe('getByID', () => {

    it('must successfully get an order by id', async () => {
      //Arrange
      orderRepositorySpy.getById.mockResolvedValue(mockOrderDao)

      //Act
      await expect(sut.getById(1)).resolves.not.toThrow()

      //Assert
      expect(orderRepositorySpy.getById).toHaveBeenCalled()
    })

    it('must return null to get order by id', async () => {
      //Arrange
      orderRepositorySpy.getById.mockResolvedValue(null)

      //Act
      try {
        await sut.getById(1);
      } catch (error) {
        // Assert
        expect((error as any).message).toEqual("Order not found!");
        expect(orderRepositorySpy.getById).toHaveBeenCalled()
      }
    })
  })
})