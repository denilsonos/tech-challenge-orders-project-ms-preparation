import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { OrderController } from '../../../../adapters/controllers/orders-controller'
import { Exception } from '../../../../core/entities/exceptions'
import { createOrderSwagger } from '../../swagger'
import { DbConnectionImpl } from '../../../database/db-connection-impl'

export const createOrderRoute = async (fastify: FastifyInstance) => {
  fastify.post(
    '/orders',
    createOrderSwagger(),
    async (request: FastifyRequest, reply: FastifyReply) => {
      const dbConn = new DbConnectionImpl()
      const controller = new OrderController(dbConn);

      await controller.create(request.body)
      .then(() => {
        return reply.status(201).send({
          message: 'Order successfully registered!',
        });
      })
      .catch((error) => {
        if (error instanceof Exception) {
          return reply.status(error.statusCode).send(error.body)
        }else {
          return reply.status(500).send(error.message)
        }
      });
    },
  )
}
