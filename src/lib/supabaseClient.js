import { createClient } from "@supabase/supabase-js";

// This one client is imported everywhere we need to talk to the database,
// authentication, or file storage. It reads its connection details from
// the ".env" file (copy ".env.example" to ".env" and fill in your real
// Supabase project URL + anon key to make this work).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are missing. Copy .env.example to .env " +
      "and fill in your project's URL and anon key."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
