import type { Env } from "../index";

export async function deleteAccount(userId: string, env: Env): Promise<Response> {
  await env.DB.prepare("DELETE FROM user_preferences WHERE user_id = ?")
    .bind(userId)
    .run();

  return new Response(null, { status: 204 });
}
