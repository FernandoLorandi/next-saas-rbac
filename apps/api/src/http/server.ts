import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { createAccount } from './routes/auth/create-account'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { getProfile } from './routes/auth/get-profile'
import { errorHandler } from './error-handler'

const app = fastify().withTypeProvider<ZodTypeProvider>() // Inicializa o server

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js Saas',
      description: 'Full-stack SaaS app with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: 'my-jwt-secret',
})

app.register(fastifyCors) // Acesso para qualquer front end

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)

app.listen({ port: 3333 }).then(() => console.log('HTTP server is running!'))
