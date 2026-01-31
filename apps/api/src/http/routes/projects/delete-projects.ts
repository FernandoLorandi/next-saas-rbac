import { auth } from '@/http/middlewares/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@saas/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function deleteProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/oranizations/:slug/projects/:projectId',
      {
        schema: {
          tags: ['projects'],
          summary: 'Delete an existent project',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            projectId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        // Captura o slug da organização
        const { slug, projectId } = request.params

        // Captura o ID do usário da sessão
        const userId = await request.getCurrentUserId()

        // Verifica o nome da organização e a role via slug
        const { organization, membership } =
          await request.getUserMembership(slug)

        const project = await prisma.project.findUnique({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
        })

        if (!project) {
          throw new BadRequestError('Project not found.')
        }

        // Verifica quais açòes o user não pode fazer
        const { cannot } = getUserPermissions(userId, membership.role)

        const authProject = projectSchema.parse(project)

        // Se 'ok' passa direto, senão retorna erro.
        if (cannot('delete', authProject)) {
          throw new UnauthorizedError(
            'You`re not allowed to delete this project.'
          )
        }

        await prisma.project.delete({ where: { id: project.id } })

        // Retorna o id do projeto no response 'ok'
        return reply.status(204).send()
      }
    )
}
