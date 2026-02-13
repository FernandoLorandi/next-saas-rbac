import Link from 'next/link'
import Image from 'next/image'

import githubIcon from '@/assets/github-icon.svg'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import signInWithEmailAndPassword from './actions'

export default function SignInPage() {
  return (
    <form action={signInWithEmailAndPassword} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input
          name="email"
          type="email"
          id="email"
          placeholder="Insert your email"
          className=""
        ></Input>
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

        <Link
          href="/auth/forgot-password"
          className="text-foreground text-xs font-medium hover:underline"
        >
          Forgot your password
        </Link>
      </div>

      <Button className="w-full" type="submit">
        Sign in with e-mail
      </Button>

      <Separator></Separator>

      <Button className="w-full" variant={'outline'} type="submit">
        <Image
          src={githubIcon}
          alt="Github icon"
          width={16}
          className="light:invert mr-2"
        ></Image>
        Sign in with github
      </Button>

      <Button className="w-full" size="xs" variant={'link'} asChild>
        <Link href="/auth/sign-up">Create new account</Link>
      </Button>
    </form>
  )
}
