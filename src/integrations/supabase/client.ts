import { createClient } from '@supabase/supabase-js'

// Lovable environment does not support VITE_* env vars. Use integration-provided globals.
// We try a few common injection points to maximize compatibility.
const g: any = globalThis as any;
const supabaseUrl: string | undefined =
  g.__LOVABLE?.supabaseUrl ||
  g.__LOVABLE_SUPABASE_URL ||
  g.LOVABLE_SUPABASE_URL ||
  g.SUPABASE_URL ||
  g.__ENV?.SUPABASE_URL ||
  g.__env?.SUPABASE_URL;

const supabaseAnonKey: string | undefined =
  g.__LOVABLE?.supabaseAnonKey ||
  g.__LOVABLE_SUPABASE_ANON_KEY ||
  g.LOVABLE_SUPABASE_ANON_KEY ||
  g.SUPABASE_ANON_KEY ||
  g.__ENV?.SUPABASE_ANON_KEY ||
  g.__env?.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Provide actionable guidance instead of crashing blindly
  // Note: anon key is safe for frontend. If integration didn't inject values,
  // you can paste your project URL and anon key here.
  // Docs: https://docs.lovable.dev/integrations/supabase/
  throw new Error(
    'Missing Supabase configuration. Ensure the Lovable Supabase integration is connected, or set window.SUPABASE_URL and window.SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
