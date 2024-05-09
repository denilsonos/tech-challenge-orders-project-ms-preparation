import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { MysqlOrmAdapter } from '../../../database/mysql-orm-adapter'
import { createClientSwagger } from '../../swagger'
import { Exception } from '../../../../core/entities/exceptions'
import { ClientController } from '../../../../adapters/controllers/client-controller'
import { DbConnectionImpl } from '../../../database/db-connection-impl'

export const createClientRoute = async (fastify: FastifyInstance) => {
  fastify.post(
    '/clients',
    createClientSwagger(),
    async (request: FastifyRequest, reply: FastifyReply) => {
        const dbConn = new DbConnectionImpl()
        const controller = new ClientController(dbConn);

        await controller.create(request.body)
        .then(() => {
          return reply.status(201).send({
            message: 'Client successfully registered!'
          });
        })
        .catch((error) => {
          if (error instanceof Exception) {
            return reply.status(error.statusCode).send(error.body)
          }
        });
    },
  )
}
