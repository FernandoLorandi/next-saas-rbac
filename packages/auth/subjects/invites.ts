import { z } from 'zod'

export const inviteSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('delete'),
    z.literal('create'),
    z.literal('get'),
  ]),
  z.literal('Invites'),
])

export type InvitesSubject = z.infer<typeof inviteSubject>
