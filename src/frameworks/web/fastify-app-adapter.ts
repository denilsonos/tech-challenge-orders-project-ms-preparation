import 'dotenv/config'
import fastify, { FastifyInstance } from 'fastify'
import multipart from '@fastify/multipart'
import cors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { AppAdapter } from '../../adapters/gateways/app-adapter'
import { swaggerOptions, swaggerUiOptions } from './swagger/swagger'
import { getAllRoute } from '../web/routes/client/get-all-route'
import { createClientRoute } from '../web/routes/client/create-client-route'
import { getByParamRoute } from '../web/routes/client/get-by-param.routes'
import { createOrderRoute } from './routes/order/create-order-route'
import { createItemRoute } from './routes/items/create-item-route'
import { deleteItemRoute } from './routes/items/delete-item-route'
import { findItemRoute } from './routes/items/find-item-route'
import { getItemRoute } from './routes/items/get-item-route'
import { updateItemRoute } from './routes/items/update-item-route'
import { findOrderRoute } from './routes/order/find-order-route'
import { getOrderRoute } from './routes/order/get-order-route'
import { updateOrderRoute } from './routes/order/update-order-route'
import { confirmOrderPaymentRoute } from './routes/payments/confirm-order-payment-route'
import { createOrderPaymentRoute } from './routes/payments/create-order-payment-route'
import { getOrderPaymentRoute } from './routes/payments/get-order-payment-route'

export class FastifyAppAdapter implements AppAdapter {
  private readonly app: FastifyInstance
  private readonly port = Number(process.env.APP_PORT)
  private readonly host = process.env.APP_HOST

  constructor() {
    this.app = fastify({
      logger: true,
      requestTimeout: 30000,
    })
  }

  public async init(): Promise<void> {
    this.app.register(multipart)
    this.app.register(cors, {
      origin: [`http://localhost:3333`],
    })

    this.app.register(fastifySwagger, swaggerOptions);
    this.app.register(fastifySwaggerUi, swaggerUiOptions);
    
    // Order Routes
    this.app.register(createOrderRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/orders
    this.app.register(findOrderRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/orders
    this.app.register(getOrderRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/orders/:id
    this.app.register(updateOrderRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/orders/:id
    this.app.register(createOrderPaymentRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/orders/payments
    this.app.register(getOrderPaymentRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/orders/payments/:id
    this.app.register(confirmOrderPaymentRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/orders/payments/confirm

    // Item Routes
    this.app.register(createItemRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/items
    this.app.register(findItemRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/items
    this.app.register(getItemRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/items/:id
    this.app.register(updateItemRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/items/:id
    this.app.register(deleteItemRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/items/:id

    // Client Routes
    this.app.register(createClientRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/clients
    this.app.register(getAllRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/client/clients
    this.app.register(getByParamRoute, { prefix: '/api/v1' }) // http://localhost:3000/api/v1/clients/:identifier
    

    await this.app
      .listen({ host: this.host, port: this.port })
      .then(() => {
        console.log(`🚀 HTTP server running on http://localhost:${this.port}`)
      })
      .catch((error) => {
        console.error('Error starting the server:', error)
        throw error
      })
  }
}
