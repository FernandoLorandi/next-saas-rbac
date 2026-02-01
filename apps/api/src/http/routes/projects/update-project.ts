import { auth } from '@/http/middlewares/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@saas/auth'
import { BadRequestError } from '../_errors/bad-request-error'

export async function updateProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/projects/:projectId',
      {
        schema: {
          tags: ['projects'],
          summary: 'Update an existent project',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            projectId: z.string().uuid(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        // Captura o slug da organização
        const { slug, projectId } = request.params

        // Captura o ID do usuário da sessão
        const userId = await request.getCurrentUserId()

        // Verifica o nome da organização e a role via slug
        const { organization, membership } =
          await request.getUserMembership(slug)

        // Busca o projeto com base no Id e organização
        const project = await prisma.project.findUnique({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
        })

        if (!project) {
          throw new BadRequestError('Project not found.')
        }

        const { name, description } = request.body

        // Verifica quais ações o user não pode fazer
        const { cannot } = getUserPermissions(userId, membership.role)

        const authProject = projectSchema.parse(project)

        // Se 'ok' passa direto, senão retorna erro.
        if (cannot('update', authProject)) {
          throw new UnauthorizedError(
            'You`re not allowed to update this project.'
          )
        }

        // Atualiza as informações do projeto
        await prisma.project.update({
          where: { id: projectId },
          data: { name, description },
        })

        // Retorna o id do projeto no response 'ok'
        return reply.status(204).send()
      }
    )
}
