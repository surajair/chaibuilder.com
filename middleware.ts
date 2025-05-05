import { updateSession } from "@/lib/update-session";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // if the url has a ?r=1, then redirect to the url without the ?r=1
  if (request.nextUrl.searchParams.has("r")) {
    const url = new URL(request.nextUrl.href);
    url.searchParams.delete("r");
    return NextResponse.redirect(
      "https://chaibuilder.com/chai/api/revalidate?redirect=true&secret=123890&paths=" +
        url.pathname
    );
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
