import { auth } from '@/http/middlewares/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'

export async function revokeInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/invites/:inviteId',
      {
        schema: {
          tags: ['invites'],
          summary: 'Revoke an invite.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            inviteId: z.string().uuid(),
          }),
          response: {
            201: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        // Captura o slug da organização
        const { slug, inviteId } = request.params

        // Captura o ID do usário da sessão
        const userId = await request.getCurrentUserId()

        // Verifica o nome da organização e a role via slug
        const { organization, membership } =
          await request.getUserMembership(slug)

        // Verifica quais açòes o user não pode fazer
        const { cannot } = getUserPermissions(userId, membership.role)

        // Se 'ok' passa direto, senão retorna erro.
        if (cannot('delete', 'Invites')) {
          throw new UnauthorizedError('You`re not allowed to delete invites.')
        }

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
            organizationId: organization.id,
          },
        })

        if (!invite) {
          throw new BadRequestError('Invite not found.')
        }

        await prisma.invite.delete({
          where: {
            id: inviteId,
          },
        })

        return reply
          .status(201)
          .send({ message: 'Remove invite has been succesfull' })
      }
    )
}
