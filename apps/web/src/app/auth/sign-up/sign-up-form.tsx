'use client'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import githubIcon from '@/assets/github-icon.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useFormState } from '@/hooks/use-form-state'
import signUpAction from './actions'
import { signInWithGithub } from '../actions'
import { useRouter } from 'next/navigation'

export function SignUpForm() {
  const router = useRouter()

  const [formState, handleSubmit, isPending] = useFormState(
    signUpAction,
    () => {
      router.push('/auth/sign-in')
    }
  )
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} action="" className="space-y-4">
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
          <Label htmlFor="name">Name</Label>
          <Input
            name="name"
            type="name"
            id="name"
            placeholder="Insert your name"
          ></Input>
          {formState.errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {formState.errors.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input
            name="email"
            type="email"
            id="email"
            placeholder="Insert your email"
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
          ></Input>

          {formState.errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {formState.errors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirm your password</Label>
          <Input
            name="password_confirmation"
            type="password"
            id="password_confirmation"
            placeholder="Confirm your password"
          ></Input>

          {formState.errors?.password_confirmation && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {formState.errors.password_confirmation[0]}
            </p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Create account'
          )}
        </Button>

        <Button className="w-full" size="xs" variant={'link'} asChild>
          <Link href="/auth/sign-in">Already register? Sign in</Link>
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
          Sign up with github
        </Button>
      </form>
    </div>
  )
}
