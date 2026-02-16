'use client'

import Link from 'next/link'
import Image from 'next/image'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useFormState } from '@/hooks/use-form-state'
import githubIcon from '@/assets/github-icon.svg'
import signInWithEmailAndPassword from './actions'
import { signInWithGithub } from '../actions'

export function SignInForm() {
  const [formState, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword
  )

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {formState.success === false && formState.message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4"></AlertTriangle>
            <AlertTitle>Sign in failed!</AlertTitle>
            <AlertDescription>
              <p>{formState.message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input
            name="email"
            type="email"
            id="email"
            placeholder="Insert your email"
            className=""
          ></Input>

          {formState.errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {formState.errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            type="password"
            id="password"
            placeholder="Insert your password"
            className=""
          ></Input>

          {formState.errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {formState.errors.password[0]}
            </p>
          )}

          <Link
            href="/auth/forgot-password"
            className="text-foreground text-xs font-medium hover:underline"
          >
            Forgot your password
          </Link>
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Sign in with e-mail'
          )}
        </Button>

        <Button className="w-full" size="xs" variant={'link'} asChild>
          <Link href="/auth/sign-up">Create new account</Link>
        </Button>
      </form>

      <Separator></Separator>

      <form action={signInWithGithub}>
        <Button className="w-full" variant={'outline'} type="submit">
          <Image
            src={githubIcon}
            alt="Github icon"
            width={16}
            className="light:invert mr-2"
          ></Image>
          Sign in with github
        </Button>
      </form>
    </div>
  )
}
