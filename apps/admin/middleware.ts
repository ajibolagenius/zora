import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/login", "/forgot-password", "/reset-password"];

// Admin roles that can access the admin panel
const ADMIN_ROLES = ["super_admin", "admin", "moderator"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the route is public
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    // Get the auth token and role from cookies
    const authToken = request.cookies.get("admin_auth_token")?.value;
    const userRole = request.cookies.get("admin_role")?.value;

    // If user is not authenticated and trying to access protected route
    if (!authToken && !isPublicRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If user is authenticated but doesn't have admin role
    if (authToken && !isPublicRoute && userRole && !ADMIN_ROLES.includes(userRole)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // If user is authenticated and trying to access auth pages
    if (authToken && isPublicRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // CSP Header generation
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://images.unsplash.com https://*.supabase.co;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https://*.supabase.co;
    upgrade-insecure-requests;
`;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", cspHeader.replace(/\s{2,}/g, " ").trim());

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set(
        "Content-Security-Policy",
        cspHeader.replace(/\s{2,}/g, " ").trim()
    );

    return response;
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
    ],
};
