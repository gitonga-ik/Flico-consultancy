import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

export function supaClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}