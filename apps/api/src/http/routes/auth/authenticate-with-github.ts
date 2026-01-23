import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { env } from '@saas/env'

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['auth'],
        description: 'Authenticate with Github account.',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const body = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID!,
        client_secret: env.GITHUB_CLIENT_SECRET!,
        redirect_uri:
          env.GITHUB_REDIRECT_URI ?? 'http://localhost:3000/api/auth/callback',
        code,
      })

      const githubAccessTokenResponse = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        }
      )

      if (!githubAccessTokenResponse.ok) {
        const errText = await githubAccessTokenResponse.text()
        request.log.error(
          { status: githubAccessTokenResponse.status, errText },
          'GitHub token exchange failed'
        )
        return reply
          .status(400)
          .send({ message: 'Failed to exchange GitHub code for token' })
      }

      const githubAccessTokenData = await githubAccessTokenResponse.json()

      request.log.info(
        { tokenResponse: githubAccessTokenData },
        'GitHub token response'
      )

      const githubAccessToken = (githubAccessTokenData as any).access_token
      if (!githubAccessToken) {
        request.log.error(
          { data: githubAccessTokenData },
          'No access token in GitHub response'
        )
        return reply
          .status(400)
          .send({ message: 'Invalid response from GitHub' })
      }

      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'next-saas-rbac',
        },
      })

      if (!githubUserResponse.ok) {
        const errText = await githubUserResponse.text()
        request.log.error(
          { status: githubUserResponse.status, errText },
          'GitHub user fetch failed'
        )
        return reply
          .status(400)
          .send({ message: 'Failed to fetch GitHub user' })
      }

      const githubUserData = await githubUserResponse.json()

      let githubId: string
      let name: string | null
      let email: string | null
      let avatarUrl: string

      try {
        const userData = z
          .object({
            id: z.number().int().transform(String),
            avatar_url: z.string().url(),
            name: z.string().nullable(),
            email: z.string().nullable(),
          })
          .parse(githubUserData)
        githubId = userData.id
        name = userData.name
        email = userData.email
        avatarUrl = userData.avatar_url
      } catch (error) {
        request.log.error(
          { data: githubUserData, error },
          'Invalid user response format'
        )
        return reply
          .status(400)
          .send({ message: 'Invalid response from GitHub' })
      }

      if (email === null) {
        const emailsRes = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${githubAccessToken}`,
            'User-Agent': 'next-saas-rbac',
          },
        })
        if (emailsRes.ok) {
          const emails = (await emailsRes.json()) as Array<{
            email: string
            primary: boolean
            verified: boolean
          }>
          const primary =
            emails.find((e) => e.primary && e.verified) ??
            emails.find((e) => e.verified) ??
            emails[0]
          email = primary?.email ?? null
        }
      }

      if (email === null) {
        return reply.status(400).send({
          message: 'Your GitHub account must have an email to authorize',
        })
      }

      let user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        user = await prisma.user.create({
          data: { name: name ?? '', email, avatarUrl },
        })
      }

      const existingAccount = await prisma.account.findFirst({
        where: { provider: 'GITHUB', userId: user.id },
      })
      if (!existingAccount) {
        await prisma.account.create({
          data: {
            provider: 'GITHUB',
            providerAccountId: githubId,
            userId: user.id,
          },
        })
      }

      const token = await reply.jwtSign(
        { sub: user.id },
        { sign: { expiresIn: '7d' } }
      )
      return reply.status(201).send({ token })
    }
  )
}
