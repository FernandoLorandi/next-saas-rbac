import appLogo from '@/assets/app-logo.svg'
import Image from 'next/image'
import { ProfileButton } from './profile-button'
import { Slash } from 'lucide-react'
import { OrganizationSwicther } from './organization-switcher'

export function Header() {
  return (
    <div className="mx-auto flex max-w-300 items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src={appLogo} className="size-6" alt="Application logotype" />

        <Slash className="text-border size-3 -rotate-[24deg]" />

        <OrganizationSwicther />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
