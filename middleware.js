import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Allow public access to auth routes and static files
  if (
    pathname.startsWith("/(auth)") || 
    pathname.startsWith("/_next") || 
    pathname.includes(".") // static files like favicon.ico
  ) {
    return NextResponse.next();
  }

  // Example: get token from cookies
  const token = req.cookies.get("jwt")?.value;

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Run middleware on all routes except auth
export const config = {
  matcher: [
    "/dashboard/:path*"
  ],
};
