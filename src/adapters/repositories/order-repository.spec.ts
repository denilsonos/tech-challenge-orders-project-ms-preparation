import { OrderDAO } from "../../base/dao/order";
import { OrderStatus } from "../../core/entities/enums/order-status";
import { DbConnectionImpl } from "../../frameworks/database/db-connection-impl";
import { OrderRepositoryImpl } from "./order-repository";

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

describe('OrderRepository', () => {
    let database: DbConnectionImpl;
    let orderRepository: OrderRepositoryImpl;

    beforeAll(() => {
        database = new DbConnectionImpl();
        orderRepository = new OrderRepositoryImpl(database);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should save order', async () => {
        // Arrange
        const orderDAO = new OrderDAO();
        jest.spyOn(database.getConnection().getRepository(OrderDAO), 'save').mockResolvedValue(orderDAO);

        // Act
        const result = await orderRepository.save(orderDAO);

        // Assert
        expect(database.getConnection().getRepository(OrderDAO).save).toHaveBeenCalledTimes(1);
        expect(result).toEqual(orderDAO);
    });

    it('should return order by ID', async () => {
        // Arrange
        jest.spyOn(database.getConnection().getRepository(OrderDAO), 'findOneBy').mockResolvedValue(new OrderDAO());

        // Act
        const result = await orderRepository.getById(1);

        // Assert
        expect(database.getConnection().getRepository(OrderDAO).findOneBy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new OrderDAO());
    });

    it('should return order find by params', async () => {
        // Arrange
        jest.spyOn(database.getConnection().getRepository(OrderDAO), 'find').mockResolvedValue([new OrderDAO()]);

        // Act
        const result = await orderRepository.findByParams(OrderStatus.Created);

        // Assert
        expect(database.getConnection().getRepository(OrderDAO).find).toHaveBeenCalledTimes(1);
        expect(result[0]).toEqual(new OrderDAO());
    });

    it('should get all orders', async () => {
        // Arrange
        const orderDAO = new OrderDAO();
        jest.spyOn(database.getConnection().getRepository(OrderDAO), 'createQueryBuilder').mockReturnThis();

        // Act
        const result = await orderRepository.getAll();

        // Assert
        expect(database.getConnection().getRepository(OrderDAO).createQueryBuilder).toHaveBeenCalledTimes(1);
        expect(result).toEqual([orderDAO]);
    });

    it('should update order', async () => {
        // Arrange
        const orderDAO = new OrderDAO();
        jest.spyOn(database.getConnection().getRepository(OrderDAO), 'update').mockReturnThis();

        // Act
        await orderRepository.update(1, 'status');

        // Assert
        expect(database.getConnection().getRepository(OrderDAO).update).toHaveBeenCalledTimes(1);
    });
});
