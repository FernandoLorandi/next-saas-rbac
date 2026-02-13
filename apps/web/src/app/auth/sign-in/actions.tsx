'use server'

import { signInWihPassword } from '@/http/sign-in-with-password'

export default async function signInWithEmailAndPassword(data: FormData) {
  const { email, password } = Object.fromEntries(data)

  const result = await signInWihPassword({
    email: String(email),
    password: String(password),
  })

  console.log(result)
}
