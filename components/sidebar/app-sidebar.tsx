"use client"

import * as React from "react"
import {
    ClipboardList,
    LifeBuoy,
    LineChart,
    Logs,
    Package,
    PanelsTopLeft,
    Send,
    Settings2,
    Users,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavAdmin } from "./nav-admin"
import { NavUser } from "./nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "../ui/sidebar"
import { ScrollArea } from "../ui/scroll-area"
import { NavHeader } from "./nav-header"
import DarkModeToggle from "../dark-mode/DarkModeToggle"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        // avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/",
            icon: PanelsTopLeft,
            isActive: true,
        },
        {
            title: "Orders",
            url: "/orders",
            icon: Package,
        },
        {
            title: "Inventory",
            url: "#",
            icon: ClipboardList,
        },
        {
            title: "Analytics",
            url: "#",
            icon: LineChart,
            items: [
                {
                    title: "Reports",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
    ],
    projects: [
        {
            name: "Logs",
            url: "#",
            icon: Logs,
        },
        {
            name: "Users",
            url: "#",
            icon: Users,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <NavHeader></NavHeader>
            </SidebarHeader>
            <SidebarContent>
                <ScrollArea className="h-full pr-2">
                    <NavMain items={data.navMain} />
                    <NavAdmin projects={data.projects} />
                </ScrollArea>
            </SidebarContent>
            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DarkModeToggle />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
