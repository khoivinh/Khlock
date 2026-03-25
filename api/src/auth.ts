import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Env } from "./index";

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS(env: Env) {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(env.CLERK_JWKS_URL));
  }
  return jwks;
}

export async function authenticateRequest(
  request: Request,
  env: Env
): Promise<{ userId: string } | Response> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing or invalid Authorization header" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = authHeader.slice(7);

  try {
    const { payload } = await jwtVerify(token, getJWKS(env));
    const userId = payload.sub;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Token missing sub claim" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return { userId };
  } catch {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}
