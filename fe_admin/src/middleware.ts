import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  // Nếu không có token thì redirect về login
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }


  return NextResponse.next();
}

// Chỉ áp dụng cho các route cần bảo vệ
export const config = {
  matcher: ["/admin/exams/:path*", "/admin/schedule/:path*", "/admin/users/:path*"],
};
