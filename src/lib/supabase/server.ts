import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseConfig } from "./env";

function requireConfig() {
  if (!hasSupabaseConfig()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };
}

let catalogClient: SupabaseClient | null = null;

/** Public catalog reads at build / SSG time. No cookies. */
export function getSupabaseServer() {
  const { url, key } = requireConfig();
  if (!catalogClient) {
    catalogClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return catalogClient;
}

/** Cookie-based server client for later API / session work. */
export async function createSupabaseServer() {
  const { url, key } = requireConfig();

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Static export / Server Component: cookies are read-only.
          }
        },
      },
    });
  } catch {
    return getSupabaseServer();
  }
}
