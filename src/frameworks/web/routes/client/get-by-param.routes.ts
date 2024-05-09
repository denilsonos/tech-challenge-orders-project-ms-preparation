import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { getByParamClientSwagger } from '../../swagger'
import { Exception } from '../../../../core/entities/exceptions'
import { ClientController } from '../../../../adapters/controllers/client-controller'
import { DbConnectionImpl } from '../../../database/db-connection-impl'

export const getByParamRoute = async (fastify: FastifyInstance) => {
  fastify.get(
    '/clients/:identifier',
    getByParamClientSwagger(),
    async (request: FastifyRequest, reply: FastifyReply) => {
      const dbConn = new DbConnectionImpl()
      const controller = new ClientController(dbConn)
      
      await controller.getByParam(request.params)
        .then((client) => {
          return reply.status(200).send({
            message: "Client found!",
            client,
          })
        })
        .catch((error) => {
          if (error instanceof Exception) {
            return reply.status(error.statusCode).send(error.body)
          }
        })
    },
  )
}