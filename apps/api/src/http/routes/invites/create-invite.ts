import { auth } from '@/http/middlewares/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { roleSchema } from '@saas/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Create a new invite member.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.string().email(),
            role: roleSchema,
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              inviteId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        // Captura o slug da organização
        const { slug } = request.params

        // Captura o ID do usário da sessão
        const userId = await request.getCurrentUserId()

        // Verifica o nome da organização e a role via slug
        const { organization, membership } =
          await request.getUserMembership(slug)

        // Verifica quais açòes o user não pode fazer
        const { cannot } = getUserPermissions(userId, membership.role)

        // Se 'ok' passa direto, senão retorna erro.
        if (cannot('create', 'Invites')) {
          throw new UnauthorizedError('You`re not allowed to create invites.')
        }

        const { email, role } = request.body

        const [, domain] = email

        if (
          organization.shoulAttachByDomain &&
          organization.domain === domain
        ) {
          throw new BadRequestError(
            `User with '${domain}' domain will join your organization automatically on login`
          )
        }

        // Verifica se existe algum invite enviado para o email digitado
        const inviteWithSameEmail = await prisma.invite.findUnique({
          where: {
            email_organizationId: {
              email,
              organizationId: organization.id,
            },
          },
        })

        if (inviteWithSameEmail) {
          throw new BadRequestError(
            'Another invite with same e-mail already exist.'
          )
        }

        // Verifica se existe algum membro na organização com o mesmo email do invite
        const membersWithSameEmail = await prisma.member.findFirst({
          where: {
            organizationId: organization.id,
            user: {
              email,
            },
          },
        })

        if (membersWithSameEmail) {
          throw new BadRequestError(
            'A member invite with same e-mail already belongs to your organization.'
          )
        }

        const invite = await prisma.invite.create({
          data: {
            email,
            role,
            organizationId: organization.id,
            authorId: userId,
          },
        })

        return reply.status(201).send({
          inviteId: invite.id,
        })
      }
    )
}
