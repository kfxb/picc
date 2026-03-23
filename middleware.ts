import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/validation-key.txt") {
    return NextResponse.rewrite(new URL("/api/validation-key", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/validation-key.txt",
};
