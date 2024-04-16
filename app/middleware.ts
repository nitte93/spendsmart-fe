// app/middleware.ts
import { withAuth } from "next-auth/middleware";

export const config = { matcher: ["/dashboard/:path*"] }; // Protect routes under /dashboard

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token, // Ensure there's a valid session token
  },
});
