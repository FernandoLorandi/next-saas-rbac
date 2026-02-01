import { auth } from '@/http/middlewares/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z, { email } from 'zod'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { roleSchema } from '@saas/auth'

export async function updateMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/members/memberId',
      {
        schema: {
          tags: ['members'],
          summary: 'Update role an user',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string().uuid(),
          }),
          body: z.object({ role: roleSchema }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        // Captura o slug da organização
        const { slug, memberId } = request.params

        // Captura o ID do usário da sessão
        const userId = await request.getCurrentUserId()

        // Verifica o nome da organização e a role via slug
        const { organization, membership } =
          await request.getUserMembership(slug)

        // Verifica quais açòes o user não pode fazer
        const { cannot } = getUserPermissions(userId, membership.role)

        // Se 'ok' passa direto, senão retorna erro.
        if (cannot('update', 'User')) {
          throw new UnauthorizedError(
            'You`re not allowed to update this member.'
          )
        }

        const { role } = request.body

        await prisma.member.update({
          where: {
            id: memberId,
            organization: organization.id,
          },
          data: {
            role: role,
          },
        })

        return reply.status(204).send()
      }
    )
}
