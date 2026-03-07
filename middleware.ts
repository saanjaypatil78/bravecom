import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// 10-Level RBAC defined in PRD
const ROLE_HIERARCHY = {
    "SUPER_ADMIN": 10,
    "QA_ANALYST": 9,
    "FRANCHISE_PARTNER": 8,
    "TEAM_LEADER": 7,
    "VENDOR": 6,
    "INVESTOR_GOLD": 5,   // Active Investor > 10L
    "INVESTOR_SILVER": 4, // Active Investor > 5L
    "INVESTOR_BRONZE": 3, // Investor > 1L
    "BUYER": 2,           // Standard authenticated shopper
    "GUEST": 1            // Unauthenticated
};

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Secure HttpOnly Cookie Session Management via Supabase SSR
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname;

    // Level 1: Guest allowed everywhere except protected routes
    if (!user && (path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/vendor') || path.startsWith('/franchise'))) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // RBAC Access Control
    if (user) {
        const userRole = user.user_metadata?.role || "BUYER";
        const userLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 2;

        // Super Admin & QA Analyst (Level 9-10) bypass all checks
        if (userLevel >= 9) return supabaseResponse;

        // Admin/Audit routes require at least QA Analyst (Level 9)
        if (path.startsWith('/admin') && userLevel < 9) {
            return NextResponse.rewrite(new URL('/unauthorized', request.url))
        }

        // Franchise routes require Franchise Partner (Level 8)
        if (path.startsWith('/franchise') && userLevel < 8) {
            return NextResponse.rewrite(new URL('/unauthorized', request.url))
        }

        // Vendor routes require Vendor (Level 6)
        if (path.startsWith('/vendor') && userLevel < 6) {
            return NextResponse.rewrite(new URL('/unauthorized', request.url))
        }

        // Any Dashboard route requires at least Buyer (Level 2)
        if (path.startsWith('/dashboard') && userLevel < 2) {
            return NextResponse.rewrite(new URL('/unauthorized', request.url))
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
