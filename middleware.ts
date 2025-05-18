import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import { LOGIN,ROOT,PUBLIC_ROUTES } from "./lib/routes";
import { getToken } from "next-auth/jwt";



const { auth } = NextAuth(authConfig);

export default auth(async(req) => {
    const { nextUrl } = req;
   
  
    const isAuthenticated = !!req.auth;
    // Get JWT token to access custom fields
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const userRole = token?.role 
  console.log('role',userRole)
    if(isAuthenticated){

console
      
    }

    const isPublicRoute = PUBLIC_ROUTES.some((route) => nextUrl.pathname.startsWith(route)) || nextUrl.pathname === ROOT;
    const isAdminRoute = nextUrl.pathname.startsWith("/admin");

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
        return NextResponse.redirect(new URL(LOGIN,nextUrl));
    }
    return NextResponse.next()

});

export const config = {
    matcher: [
      "/((?!api|_next|favicon.ico|.*\\..*).*)", // Exclude Next.js internal routes and API routes
      "/", // Include the root route
    ],
  };