import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request)
    const isSignIn = request.nextUrl.pathname === "/login"

    if (!sessionCookie && !isSignIn) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (sessionCookie && isSignIn) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|favicon.ico).*)"],
}
