import { NextRequest, NextResponse, userAgent } from "next/server";

export function middleware(req: NextRequest) {
  const agent = userAgent(req);

  if (agent.isBot) {
    req.nextUrl.pathname = "/no-bot";
    return NextResponse.rewrite(req.nextUrl);
  }

  if (!req.url.includes("/enter") && !req.cookies.has("carrotsession")) {
    req.nextUrl.pathname = "/enter";
    return NextResponse.redirect(req.nextUrl);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
