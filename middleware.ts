import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import { LOGIN, ROOT, PUBLIC_ROUTES } from "./lib/routes";
import { getToken } from "next-auth/jwt";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;
  // Get JWT token to access custom fields
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  const userRole = token?.role;
  const isBlocked = token?.isBlocked;

  const isPublicRoute =
    PUBLIC_ROUTES.some((route) => nextUrl.pathname.startsWith(route)) ||
    nextUrl.pathname === ROOT;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  if (isAuthenticated && isBlocked && nextUrl.pathname !== LOGIN) {
    // Destroy the session cookie by clearing it
    // const response = NextResponse.redirect(new URL(LOGIN, nextUrl));
    const loginUrl = new URL(LOGIN, nextUrl);
    loginUrl.searchParams.set("blocked", "true"); // Add param to indicate block

    const response = NextResponse.redirect(loginUrl);
    response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
    response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 });
    return response;
  }

   // Redirect already authenticated users away from login page
  if (isAuthenticated && nextUrl.pathname === LOGIN) {
    return NextResponse.redirect(new URL("/", nextUrl)); // Redirect to home 
  }
  if (isAuthenticated && nextUrl.pathname === "/admin-login" && userRole === "admin") {
  return NextResponse.redirect(new URL("/admin/admindashboard", nextUrl));
}

  // Handle admin route access
  if (isAdminRoute) {
    if (!isAuthenticated) {
      if (nextUrl.pathname !== "/admin-login") {
        return NextResponse.redirect(new URL("/admin-login", nextUrl));
      }
    } else if (userRole !== "admin") {
      if (nextUrl.pathname !== "/admin-login") {
        return NextResponse.redirect(new URL("/admin-login", nextUrl));
      }
    }
  }

  // For non-admin routes, apply existing logic
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL(LOGIN, nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|.*\\..*).*)", // Exclude Next.js internal routes and API routes
    "/", // Include the root route
  ],
};
