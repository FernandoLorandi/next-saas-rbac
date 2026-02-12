import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

import githubIcon from '@/assets/github-icon.svg'
import Image from 'next/image'

export default function ForgotPasswordPage() {
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

      <Button className="w-full" type="submit">
        Recover password
      </Button>

      <Button className="w-full" size="xs" variant={'link'} asChild>
        <Link href="/auth/sign-in">Sign in instead</Link>
      </Button>
    </form>
  )
}
