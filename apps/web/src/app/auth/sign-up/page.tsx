import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import githubIcon from '@/assets/github-icon.svg'
import Image from 'next/image'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input
          name="name"
          type="name"
          id="name"
          placeholder="Insert your name"
        ></Input>
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input
          name="email"
          type="email"
          id="email"
          placeholder="Insert your email"
        ></Input>
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          name="password"
          type="password"
          id="password"
          placeholder="Insert your password"
        ></Input>
      </div>

      <div className="space-y-1">
        <Label htmlFor="password_confirmation">Confirm your password</Label>
        <Input
          name="password_confirmation"
          type="password"
          id="password_confirmation"
          placeholder="Confirm your password"
        ></Input>
      </div>

      <Button className="w-full" type="submit">
        Create account
      </Button>

      <Button className="w-full" size="xs" variant={'link'} asChild>
        <Link href="/auth/sign-in">Already register? Sign in</Link>
      </Button>

      <Separator></Separator>

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
  )
}
