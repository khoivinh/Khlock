import { authenticateRequest } from "./auth";
import { getPreferences, putPreferences } from "./routes/preferences";
import { deleteAccount } from "./routes/account";

export interface Env {
  DB: D1Database;
  CLERK_JWKS_URL: string;
  ALLOWED_ORIGINS: string;
}

function getCorsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get("Origin") || "";
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());

  if (!allowed.includes(origin)) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

function withCors(response: Response, corsHeaders: Record<string, string>): Response {
  const newHeaders = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    newHeaders.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = getCorsHeaders(request, env);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Auth — all routes require a valid JWT
    const authResult = await authenticateRequest(request, env);
    if (authResult instanceof Response) {
      return withCors(authResult, corsHeaders);
    }
    const { userId } = authResult;

    // Route
    let response: Response;

    if (path === "/api/preferences" && request.method === "GET") {
      response = await getPreferences(userId, env);
    } else if (path === "/api/preferences" && request.method === "PUT") {
      response = await putPreferences(userId, request, env);
    } else if (path === "/api/account" && request.method === "DELETE") {
      response = await deleteAccount(userId, env);
    } else {
      response = new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return withCors(response, corsHeaders);
  },
};
