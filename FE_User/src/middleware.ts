import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Nếu không có token thì redirect về login
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Chỉ áp dụng cho các route cần bảo vệ
export const config = {
  matcher: ["/flashcards/:path*", "/profile/:id*"],
};
