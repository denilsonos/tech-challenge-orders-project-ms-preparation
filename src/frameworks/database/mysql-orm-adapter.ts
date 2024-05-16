import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { OrmAdapter } from '../../adapters/gateways/orm-adapter'
import { OrderDAO } from '../../base/dao/order'
import { FakeQueue } from '../../adapters/external-services/fake-queue-service/fake-queue-service-adapter'

export class MysqlOrmAdapter implements OrmAdapter {
  private static instance: MysqlOrmAdapter | undefined // eslint-disable-line no-use-before-define
  public database!: DataSource

  public static getInstance(): MysqlOrmAdapter {
    if (!MysqlOrmAdapter.instance) {
      MysqlOrmAdapter.instance = new MysqlOrmAdapter()
    }

    return MysqlOrmAdapter.instance
  }

  public async init(): Promise<void> {
    this.database = this.databaseConnection()

    if (this.database.isInitialized) {
      console.log('Database already connected')
    }
    await this.database
      .initialize()
      .then(() => {
        console.log('🚀 Connected to the database')
      })
      .catch((error) => {
        console.error('Error initialize to the database:', error)
        throw error
      })
  }

  private databaseConnection() {
    console.log("Db values:")
    console.log("Db DB_HOST:"+process.env.DB_HOST)
    console.log("Db DB_PORT:"+process.env.DB_PORT)
    console.log("Db DB_USER:"+process.env.DB_USER)
    console.log("Db DB_PASSWORD:"+process.env.DB_PASSWORD)
    console.log("Db DB_NAME_PREPARATION:"+process.env.DB_NAME_PREPARATION)

    return new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME_PREPARATION,
      synchronize: true,
      logging: false,
      entities: [
        OrderDAO,
        FakeQueue
      ],
      migrations: [],
      subscribers: [],
    })
  }
}
