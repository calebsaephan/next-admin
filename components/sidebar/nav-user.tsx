"use client"

import { ChevronsUpDown, LogOut, UserRound } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "../ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function NavUser({
    user,
}: {
    user: {
        name: string
        email: string
        avatar?: string
    }
}) {
    const { isMobile } = useSidebar()
    const router = useRouter()

    const logout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login")
                },
            },
        })
        router.refresh()
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=closed]:ml-1 transition-all duration-200"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {user.avatar ? (
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                ) : (
                                    <></>
                                )}
                                <AvatarFallback className="rounded-lg">
                                    CN
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <UserRound />
                                Account
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
