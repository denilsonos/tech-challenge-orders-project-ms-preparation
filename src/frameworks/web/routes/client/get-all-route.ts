import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { getAllClientSwagger } from '../../swagger'
import { Exception } from '../../../../core/entities/exceptions'
import { ClientController } from '../../../../adapters/controllers/client-controller'
import { DbConnectionImpl } from '../../../database/db-connection-impl'

export const getAllRoute = async (fastify: FastifyInstance) => {
  fastify.get(
    '/clients',
    getAllClientSwagger(),
    async (_request: FastifyRequest, reply: FastifyReply) => {
  
      const dbConn = new DbConnectionImpl()
      const controller = new ClientController(dbConn)

      await controller.getAll()
        .then((clients) => {
          return reply.status(200).send({ clients })
        })
        .catch((error) => {
          if (error instanceof Exception) {
            return reply.status(error.statusCode).send(error.body)
          }
        })
    },
  )
}
