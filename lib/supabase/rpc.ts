import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export class RpcError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
  }
}

/**
 * Calls a Postgres function through Supabase's REST API with the public anon
 * key, straight from the browser. Every function used this way is granted to
 * `anon` and validates its own input (see supabase/*.sql), so this needs no
 * server route, and a plain fetch keeps supabase-js out of the page bundle.
 */
export async function callRpc<T>(
  fn: string,
  args: Record<string, unknown> = {},
): Promise<T> {
  const key = getSupabaseAnonKey();
  const response = await fetch(`${getSupabaseUrl()}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(args),
  });
  const data = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const code =
      data && typeof data === "object" && "code" in data
        ? String((data as { code: unknown }).code)
        : undefined;
    throw new RpcError(`${fn} failed`, response.status, code);
  }
  return data as T;
}
