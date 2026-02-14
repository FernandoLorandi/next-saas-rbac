'use server'

import { signInWihPassword } from '@/http/sign-in-with-password'
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export default async function signInWithEmailAndPassword(
  previousState: unknown,
  data: FormData
) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { email, password } = result.data
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const { token } = await signInWihPassword({
    email: String(email),
    password: String(password),
  })

  console.log(token)

  return { success: true, message: null, errors: null }
}
