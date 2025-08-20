"use client"

import dynamic from "next/dynamic"

const AppSidebar = dynamic(
    () => import("./app-sidebar").then((mod) => mod.default),
    {
        ssr: false,
    }
)

export function SidebarWrapper() {
    return <AppSidebar />
}
