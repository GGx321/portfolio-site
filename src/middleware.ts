import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "ru"] as const;
const defaultLocale = "en";

function getLocaleFromHeaders(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  
  if (!acceptLanguage) return defaultLocale;
  
  const languages = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().toLowerCase().split("-")[0]);
  
  for (const lang of languages) {
    // Russian or Ukrainian -> Russian
    if (lang === "ru" || lang === "uk") {
      return "ru";
    }
    if (lang === "en") {
      return "en";
    }
  }
  
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  
  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) {
    return NextResponse.next();
  }
  
  // Redirect to locale-prefixed URL
  const locale = getLocaleFromHeaders(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
