import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public (non-protected) routes
const isPublicRoute = createRouteMatcher([
  "/", 
  "/api/webhook/clerk",
]);

export default clerkMiddleware((auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) return;

  // ✅ Protect all other routes using the new API
  auth.protect();
});

export const config = {
  matcher: [
    // Protect everything except static files, _next, and favicon
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
