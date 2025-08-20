import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import "./globals.css"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Funnel_Sans, Fira_Code, Figtree, Roboto_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/dark-mode/ThemeProvider"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const funnelSans = Figtree()
const firaCode = Roboto_Mono()

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    const isSignedIn = !!session?.user

    return (
        <html
            lang="en"
            className={`${GeistSans.variable} ${GeistMono.variable} ${funnelSans.className} ${firaCode.className}`}
            suppressHydrationWarning
        >
            <body className="h-screen overflow-hidden flex bg-sidebar font-sans">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={true}
                >
                    <SidebarProvider>
                        {isSignedIn && <AppSidebar />}
                        <div className="flex max-h-screen w-full m-1 box-border rounded-lg bg-background overflow-hidden">
                            <div className="flex-1 p-2 overflow-auto box-border">
                                <main>{children}</main>
                            </div>
                        </div>
                    </SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
