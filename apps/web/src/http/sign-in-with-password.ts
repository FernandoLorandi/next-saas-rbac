import { api } from './api-client'

interface signInWithPasswordRequest {
  email: string
  password: string
}
interface signInWithPasswordResponse {
  token: string
}

export async function signInWihPassword({
  email,
  password,
}: signInWithPasswordRequest) {
  const result = await api
    .post('sessions/password', {
      json: {
        email,
        password,
      },
    })
    .json<signInWithPasswordResponse>()

  return result
}
