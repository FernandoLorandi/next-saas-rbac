import { auth } from '@/http/middlewares/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { organizationSchema } from '@saas/auth'

import { z } from 'zod'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function shutdownOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organization/:slug',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Shutdown an exists organization.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        //Capturando o slug da organização da url
        const { slug } = await request.params

        // Capturando o id do usário
        const userId = await request.getCurrentUserId()

        // Verificando a organização e a role do slug
        const { membership, organization } =
          await request.getUserMembership(slug)

        // Parse nos objetos recebidos
        const authOrganization = organizationSchema.parse(organization)

        // Verifica o permissionamento
        const { cannot } = getUserPermissions(userId, membership.role)

        // Verifica as roles passando o objeto autenticado
        if (cannot('delete', authOrganization)) {
          throw new UnauthorizedError(
            'You`re not allowed to shutdown this organization.'
          )
        }

        // Deleta o projeto no banco
        await prisma.organization.delete({
          where: { id: organization.id },
        })

        return reply.status(204).send()
      }
    )
}
