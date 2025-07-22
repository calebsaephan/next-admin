import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import "./globals.css"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body className="h-screen overflow-hidden flex bg-sidebar">
                <SidebarProvider>
                    <AppSidebar />
                    <div className="flex max-h-screen w-full m-1 box-border rounded-lg bg-background overflow-hidden">
                        <div className="flex-1 p-2 overflow-auto box-border">
                            <main>{children}</main>
                        </div>
                    </div>
                </SidebarProvider>
            </body>
        </html>
    )
}
