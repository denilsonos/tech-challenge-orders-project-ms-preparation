import { OrderDAO } from "../../base/dao/order";
import { OrderStatus } from "../../core/entities/enums/order-status";
import { DbConnectionImpl } from "../../frameworks/database/db-connection-impl";
import { OrderController } from "./orders-controller";
import { OrderUseCase } from "../gateways/use-cases/order-use-case";
import { OrderEntity } from "../../core/entities/order";

jest.mock('typeorm', () => {
    return {
        Entity: () => jest.fn(),
        PrimaryGeneratedColumn: () => jest.fn(),
        Column: () => jest.fn(),
        CreateDateColumn: () => jest.fn(),
        UpdateDateColumn: () => jest.fn(),
        ManyToMany: () => jest.fn(),
        JoinTable: () => jest.fn(),
        OneToOne: () => jest.fn(),
        JoinColumn: () => jest.fn(),
    }
});

jest.mock('../../frameworks/database/db-connection-impl', () => {
    return {
        DbConnectionImpl: jest.fn().mockImplementation(() => {
            return {
                getConnection: jest.fn().mockReturnValue({
                    getRepository: jest.fn().mockReturnValue({
                        save: jest.fn().mockResolvedValue(new OrderDAO()),
                        findOneBy: jest.fn().mockResolvedValue(new OrderDAO()),
                        find: jest.fn().mockResolvedValue(new OrderDAO()),
                        update: jest.fn().mockResolvedValue(new OrderDAO()),
                        delete: jest.fn().mockReturnThis(),
                        createQueryBuilder: jest.fn().mockReturnThis(),
                        addOrderBy: jest.fn().mockReturnThis(),
                        orderBy: jest.fn().mockReturnThis(),
                        where: jest.fn().mockReturnThis(),
                        leftJoinAndSelect: jest.fn().mockReturnThis(),
                        getMany: jest.fn().mockResolvedValue([new OrderDAO()]),
                    })
                })
            }
        })
    }
});

const orderUseCaseSpy: jest.Mocked<OrderUseCase> = {
    create: jest.fn(),
    getById: jest.fn(),
    findByParams: jest.fn(),
    update: jest.fn(),
}

describe('OrderController', () => {

    let database: DbConnectionImpl;
    let orderController: OrderController;

    beforeAll(() => {
        database = new DbConnectionImpl();
        orderController = new OrderController(database);
        orderController.setDependencies(orderUseCaseSpy)
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe('create', () => {
        it('should create a new order', async () => {
            // Arrange
            const bodyParams = {
                idOrder: 1,
                status: OrderStatus.Created,
                createdAt: new Date()
            };

            const orderDao = new OrderDAO();
            orderDao.idOrder = 1;
            orderDao.status = OrderStatus.Created
            orderDao.createdAt = bodyParams.createdAt

            orderUseCaseSpy.create.mockResolvedValue(orderDao)

            // Act
            const result = await orderController.create(bodyParams);
            expect(orderUseCaseSpy.create).toHaveBeenCalled()
            expect(result.idOrder).toEqual(1)
        });

        it('should return error to create order - bad request', async () => {
            // Arrange
            const bodyParams = {
                status: OrderStatus.Created,
                createdAt: new Date()
            };

            // Act
            try {
                await orderController.create(bodyParams);
            } catch (error) {
                expect((error as any).message).toEqual("Validation error!");
            }
        });
    });


    describe('findByParams', () => {
        it('should return order by params', async () => {
            // Arrange
            const bodyParams = {
                status: OrderStatus.Created
            };

            const orderEntity = new OrderEntity(1, OrderStatus.Created, new Date(), new Date());
            orderUseCaseSpy.findByParams.mockResolvedValue([orderEntity])

            // Act
            const result = await orderController.findByParams(bodyParams);

            //Assert
            expect(result[0]).toEqual(orderEntity)
        });

        it('should return error to create order - bad request', async () => {
            // Arrange
            const bodyParams = {
                status: "test"
            };

            // Act
            try {
                await orderController.findByParams(bodyParams);
            } catch (error) {
                expect((error as any).message).toEqual("Validation error!");
            }
        });
    });

    describe('update', () => {
        it('should update an order', async () => {
            // Arrange
            const bodyParams = {
                status: OrderStatus.Created
            };

            const params = {
                id: "1"
            };

            const orderEntity = new OrderEntity(1, OrderStatus.Created, new Date(), new Date());
            orderUseCaseSpy.getById.mockResolvedValue(orderEntity)

            // Act
            await orderController.update(bodyParams, params);

            //Assert
        });

        it('should return error status missing', async () => {
            // Arrange
            const bodyParams = {};

            const params = {
                id: "1"
            };

            // Act
            try {
                await orderController.update(bodyParams, params);
            } catch (error) {
                //Assert
                expect((error as any).message).toEqual("Validation error!");
            }
        });

        it('should return error status empty', async () => {
            // Arrange
            const bodyParams = {
                status: ""
            };

            const params = {
                id: "1"
            };

            // Act
            try {
                await orderController.update(bodyParams, params);
            } catch (error) {
                //Assert
                expect((error as any).message).toEqual("Validation error! Status must be a one of CREATED, PENDING_PAYMENT, RECEIVED, IN_PREPARATION, READY, FINISHED");
            }
        });

        it('should return error id missing', async () => {
            // Arrange
            const bodyParams = {
                status: OrderStatus.Created
            };

            const params = {};

            // Act
            try {
                await orderController.update(bodyParams, params);
            } catch (error) {
                //Assert
                expect((error as any).message).toEqual("Validation error!");
            }
        });

        it('should update an order', async () => {
            // Arrange
            const bodyParams = {
                status: OrderStatus.Created
            };

            const params = {
                id: "1"
            };

            orderUseCaseSpy.getById.mockResolvedValue(null)

            // Act
            try {
                await orderController.update(bodyParams, params);
            } catch (error) {
                //Assert
                expect((error as any).message).toEqual("Order not found!");
            }
        });

        it('Status ready', async () => {
            // Arrange
            const bodyParams = {
                status: OrderStatus.Created
            };

            const params = {
                id: "1"
            };

            const orderEntity = new OrderEntity(1, OrderStatus.Ready, new Date(), new Date());
            orderUseCaseSpy.getById.mockResolvedValue(orderEntity)

            // Act
            try {
                await orderController.update(bodyParams, params);
            } catch (error) {
                //Assert
                expect((error as any).message).toEqual("Order is ready!");
            }
        });
    });
});
