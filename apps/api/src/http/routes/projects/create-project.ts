import { auth } from '@/http/middlewares/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'

export async function createProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/oranizations/:slug/projects',
      {
        schema: {
          tags: ['projects'],
          summary: 'Create a new project',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              projectId: z.string().uuid(),
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
        if (cannot('create', 'Project')) {
          throw new UnauthorizedError(
            'You`re not allowed to create new projects.'
          )
        }

        // Captura os dados vindos do body da requisição
        const { name, description } = request.body

        // Cria um novo projeto dentro do banco de dados
        const project = await prisma.project.create({
          data: {
            name,
            slug: createSlug(name),
            description,
            organizationId: organization.id,
            ownerId: userId,
          },
        })

        // Retorna o id do projeto no response 'ok'
        return reply.status(201).send({
          projectId: project.id,
        })
      }
    )
}
