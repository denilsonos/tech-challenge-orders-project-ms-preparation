import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { getOrderPaymentSwagger } from '../../swagger'
import { PaymentController } from '../../../../adapters/controllers/payment-controller'
import { Exception } from '../../../../core/entities/exceptions'
import { DbConnectionImpl } from '../../../database/db-connection-impl'

export const getOrderPaymentRoute = async (fastify: FastifyInstance) => {
  fastify.get(
    '/orders/payments/:id',
    getOrderPaymentSwagger(),
    async (request: FastifyRequest, reply: FastifyReply) => {
      const dbConn = new DbConnectionImpl()
      const controller = new PaymentController(dbConn);
      
      await controller
        .getOrder(request.params)
        .then((payment) => {
          return reply.status(200).send({
            message: 'Payment found successfully!',
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
