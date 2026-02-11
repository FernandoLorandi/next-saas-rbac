import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

import githubIcon from '@/assets/github-icon.svg'
import Image from 'next/image'

export default function SignInPage() {
  return (
    <form action="" className="space-y-4">
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
        <Image src={githubIcon} alt="Github icon" width={16}></Image>
        Sign in with github
      </Button>
    </form>
  )
}
