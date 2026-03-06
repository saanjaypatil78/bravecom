/**
 * Next.js Middleware for JWT Validation and RBAC
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

// Public paths that don't require authentication
const PUBLIC_PATHS = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/api/auth',
    '/api/webhooks',
    '/_next',
    '/favicon.ico',
];

// Role-based route access
const ROLE_ROUTES: Record<string, number> = {
    '/dashboard': 2,
    '/dashboard/investments': 3,
    '/dashboard/vendor': 4,
    '/dashboard/finance': 5,
    '/dashboard/compliance': 6,
    '/dashboard/admin': 7,
    '/dashboard/super-admin': 8,
    '/api/admin': 7,
    '/api/finance': 5,
    '/api/compliance': 6,
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for public paths
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Check rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
        );
    }

    // Get token from cookie or header
    const token = request.cookies.get('auth-token')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
        // Allow access to login/register for redirect
        if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
            return NextResponse.next();
        }
        return redirectToLogin(pathname);
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            email: string;
            role: number;
            permissions: string[];
        };

        // Check role-based access
        const requiredRole = getRequiredRole(pathname);
        if (requiredRole && decoded.role < requiredRole) {
            // Log permission denied
            console.warn(`[RBAC] Access denied: User role ${decoded.role} < required ${requiredRole} for ${pathname}`);

            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        // Add user info to headers for API routes
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', decoded.userId);
        requestHeaders.set('x-user-role', decoded.role.toString());
        requestHeaders.set('x-user-email', decoded.email);

        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

        return response;
    } catch (error) {
        console.error('[Middleware] Token verification failed:', error);

        // Token expired or invalid - clear cookie and redirect
        const response = redirectToLogin(pathname);
        response.cookies.delete('auth-token');
        return response;
    }
}

function getRequiredRole(pathname: string): number | null {
    for (const [route, role] of Object.entries(ROLE_ROUTES)) {
        if (pathname.startsWith(route)) {
            return role;
        }
    }
    return null;
}

function redirectToLogin(pathname: string): NextResponse {
    const loginUrl = new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth-token');
    return response;
}

function checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(identifier, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW,
        });
        return true;
    }

    if (record.count >= RATE_LIMIT) {
        return false;
    }

    record.count++;
    return true;
}

// Clean up old rate limit entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, RATE_LIMIT_WINDOW);

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
