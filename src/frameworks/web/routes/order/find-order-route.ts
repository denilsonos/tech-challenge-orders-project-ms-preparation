import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { OrderController } from '../../../../adapters/controllers/orders-controller'
import { Exception } from '../../../../core/entities/exceptions'
import { findOrderSwagger } from '../../swagger'
import { DbConnectionImpl } from '../../../database/db-connection-impl'

export const findOrderRoute = async (fastify: FastifyInstance) => {
  fastify.get(
    '/orders',
    findOrderSwagger(),
    async (request: FastifyRequest, reply: FastifyReply) => {
      const dbConn = new DbConnectionImpl()
      const controller = new OrderController(dbConn);

      await controller.findByParams(request.query).then((orders) => {
        if (orders.length > 0) {
          return reply.status(200).send({ orders })
        }else{
          return reply.status(204).send({})
        }
      })
      .catch((error) => {
        if (error instanceof Exception) {
          return reply.status(error.statusCode).send(error.body)
        }else {
          return reply.status(500).send(error.message)
        }
      })
    },
  )
}
