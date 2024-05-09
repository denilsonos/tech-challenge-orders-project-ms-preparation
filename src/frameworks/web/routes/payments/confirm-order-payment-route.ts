import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { confirmOrderPaymentSwagger } from '../../swagger'
import { Exception } from '../../../../core/entities/exceptions'
import { PaymentController } from '../../../../adapters/controllers/payment-controller'
import { DbConnectionImpl } from '../../../database/db-connection-impl'

export const confirmOrderPaymentRoute = async (fastify: FastifyInstance) => {
  fastify.post(
    '/webhook/payments/confirm',
    confirmOrderPaymentSwagger(),
    async (request: FastifyRequest, reply: FastifyReply) => {
      const dbConn = new DbConnectionImpl()
      const controller = new PaymentController(dbConn);

      await controller
        .confirm(request.body)
        .then(() => {
          return reply.status(200).send({
            message: 'Order payment confirmed successfully',
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
