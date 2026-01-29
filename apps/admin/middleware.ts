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

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
    ],
};
