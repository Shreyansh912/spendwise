import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // Print diagnostics in the browser console
  console.log("Supabase Client Init Check:", {
    url: supabaseUrl || "MISSING",
    keyAvailable: Boolean(supabaseKey),
    keyPrefix: supabaseKey ? supabaseKey.slice(0, 12) + "..." : "MISSING",
  });

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables: Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are defined."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}