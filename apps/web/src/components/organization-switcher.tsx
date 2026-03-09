import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'

export function OrganizationSwicther() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary flex w-44 items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
        <span className="text-muted-foreground">Select organization</span>
        <ChevronsUpDown className="text-muted-foreground ml-auto size-4"></ChevronsUpDown>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-50"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            Organizations
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Avatar className="mr-2 size-5">
              <AvatarImage src="https://github.com/rocketseat.png" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <span className="line-clamp-1">Rocketseat</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/api/auth/sign-out">
            <PlusCircle className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
