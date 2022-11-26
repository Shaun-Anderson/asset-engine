import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) return NextResponse.next();
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("from middleware ", token);

  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  // If user is authenticated, continue.
  return NextResponse.next();
}
