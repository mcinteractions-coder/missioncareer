import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Add CDN cache headers on GET HTML responses so repeat hits are served
// from the edge cache instead of re-rendering — cuts response time dramatically.
const cacheHeadersMiddleware = createMiddleware().server(async ({ next, request }) => {
  const response = await next();
  try {
    const res = response as unknown as Response;
    if (
      request?.method === "GET" &&
      res &&
      typeof res.headers?.get === "function" &&
      (res.headers.get("content-type") ?? "").includes("text/html") &&
      !res.headers.get("cache-control")
    ) {
      res.headers.set(
        "cache-control",
        "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      );
    }
  } catch {
    // no-op: never let header tagging break the response
  }
  return response;
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, cacheHeadersMiddleware],
}));
