import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import "./globals.css"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/dark-mode/ThemeProvider"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className={`${GeistSans.variable} ${GeistMono.variable}`}
            suppressHydrationWarning
        >
            <body className="h-screen overflow-hidden flex bg-sidebar">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={true}
                >
                    <SidebarProvider>
                        <AppSidebar />
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
