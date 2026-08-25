import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAdminRoute) {
    return;
  }

  const session = req.auth;

  if (!session?.user) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }

  if (session.user.role !== "ADMIN") {
    return Response.redirect(new URL("/", req.nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/admin/:path*"],
};