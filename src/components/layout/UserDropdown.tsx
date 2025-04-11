
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { User } from "next-auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { signOut } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"

interface UserNavProps {
  user?: Pick<User, "name" | "image" | "email">
  isPro?: boolean
  isLoading?: boolean
}

export function UserNav({ user, isPro = false, isLoading }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/20 text-rose-900 dark:text-rose-100 focus-visible:ring-2 focus-visible:ring-rose-300 dark:focus-visible:ring-rose-700 transition-colors"
        >
          <Avatar className="h-8 w-8 border-2 border-rose-300 dark:border-rose-700">
            <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
            <AvatarFallback>
              {user?.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          {isPro && (
            <Badge
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 bg-gradient-to-r from-rose-400 to-amber-300 text-white shadow-sm"
              variant="default"
            >
              Pro
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[240px] bg-rose-50/90 dark:bg-rose-900/80 backdrop-blur-md border border-rose-200 dark:border-rose-700 shadow-xl rounded-xl z-[99]"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal text-rose-900 dark:text-rose-100">
          <div className="flex flex-col space-y-1">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3 bg-rose-200 dark:bg-rose-800 rounded" />
                <Skeleton className="h-3 w-1/2 bg-rose-200 dark:bg-rose-800 rounded" />
              </div>
            ) : (
              <>
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-rose-700 dark:text-rose-300 truncate">
                  {user?.email}
                </p>
              </>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-rose-200 dark:bg-rose-700" />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            signOut({ callbackUrl: "/" })
          }}
          className="cursor-pointer text-rose-800 dark:text-rose-100 hover:bg-rose-100 dark:hover:bg-rose-800 transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4 text-rose-600 dark:text-rose-300" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}