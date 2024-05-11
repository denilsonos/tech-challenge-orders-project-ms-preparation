import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToMany } from 'typeorm'
import { FakeQueue } from '../../adapters/external-services/fake-queue-service/fake-queue-service-adapter'
import { OrderEntity } from '../../core/entities/order'

@Entity('order')
export class OrderDAO {
  @PrimaryGeneratedColumn({ type: 'int', name: 'idOrder' })
  public idOrder!: number

  @Column({ type: 'varchar', name: 'status' })
  public status!: string

  @CreateDateColumn({ type: "datetime", name: 'createdAt' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updatedAt' })
  public updatedAt!: Date;

  @OneToOne(() => FakeQueue, (queue) => queue.order)
  public queue?: FakeQueue

  constructor() { }

  static daoToEntity(orderDao: OrderDAO): OrderEntity {
    return new OrderEntity(orderDao.idOrder, orderDao.status, orderDao.createdAt, orderDao.updatedAt);       
  }

  static daosToEntities(orderDaos: OrderDAO[]): OrderEntity[] {

    const listEntities: OrderEntity[] = [];

    orderDaos.forEach(orderDAO => {
      listEntities.push(OrderDAO.daoToEntity(orderDAO))
    });

    return listEntities;
  }

}