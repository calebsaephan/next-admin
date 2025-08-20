import { SidebarProvider } from "@/components/ui/sidebar"
import "./globals.css"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Figtree, Roboto_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/dark-mode/ThemeProvider"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { SidebarWrapper } from "@/components/sidebar/sidebar-wrapper"

const figtree = Figtree({ subsets: ["latin"] })
const robotoMono = Roboto_Mono({ subsets: ["latin"] })

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
            className={`${GeistSans.variable} ${GeistMono.variable} ${figtree.className} ${robotoMono.className}`}
            suppressHydrationWarning
        >
            <body className="h-screen overflow-hidden flex bg-sidebar font-sans">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={true}
                >
                    <SidebarProvider>
                        {isSignedIn && <SidebarWrapper />}
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
