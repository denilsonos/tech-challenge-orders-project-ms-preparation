import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createOrderPaymentSwagger } from '../../swagger'
import { Exception } from '../../../../core/entities/exceptions'
import { PaymentController } from '../../../../adapters/controllers/payment-controller'
import { DbConnectionImpl } from '../../../database/db-connection-impl'

export const createOrderPaymentRoute = async (fastify: FastifyInstance) => {
  fastify.post(
    '/orders/payments',
    createOrderPaymentSwagger(),
    async (request: FastifyRequest, reply: FastifyReply) => {
      const dbConn = new DbConnectionImpl()
      const controller = new PaymentController(dbConn);
      
      await controller
        .create(request.body)
        .then((payment) => {
          return reply.status(201).send({
            message: 'Payment successfully registered!',
            payment,
          })
        })
        .catch((error: any) => {
          if (error instanceof Exception) {
            return reply.status(error.statusCode).send(error.body)
          }
        })
    },
  )
}
