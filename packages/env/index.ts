import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// Orquestra a utilização de variaveis de ambiente

// server: controla as variaveis via server side
// cliente: variaveis acessiveis via client side
// shared: variaveis compartilhadas entre cliente x server
// emptyStingAsUndefined se a variável se ambiente estiver vazia, ela é ignorada

export const env = createEnv({
  server: {
    SERVER_PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().url(),

    JWT_SECRET: z.string(),

    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GITHUB_REDIRECT_URI: z.string().url(),
  },
  client: {},
  shared: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,

    SERVER_PORT: process.env.SERVER_PORT,
  },
  emptyStringAsUndefined: true,
})
