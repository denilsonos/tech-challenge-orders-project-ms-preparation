import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { recuseOrderPaymentSwagger } from '../../swagger'
import { Exception } from '../../../../core/entities/exceptions'
import { PaymentController } from '../../../../adapters/controllers/payment-controller'
import { DbConnectionImpl } from '../../../database/db-connection-impl'

export const recuseOrderPaymentRoute = async (fastify: FastifyInstance) => {
  fastify.post(
    '/webhook/payments/recuse',
    recuseOrderPaymentSwagger(),
    async (request: FastifyRequest, reply: FastifyReply) => {
      const dbConn = new DbConnectionImpl()
      const controller = new PaymentController(dbConn);

      await controller
        .recuse(request.body)
        .then(() => {
          return reply.status(200).send({
            message: 'Order payment recused',
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
