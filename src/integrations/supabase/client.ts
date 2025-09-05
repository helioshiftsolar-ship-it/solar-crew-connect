import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Use Lovable integration runtime config instead of VITE_* env vars.
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

// Debug which sources are present (values are booleans; no secrets logged)
if (!(g.__LOVABLE?.__loggedSupabasePresence)) {
  g.__LOVABLE = { ...(g.__LOVABLE || {}), __loggedSupabasePresence: true };
  console.info('[Supabase] Presence check', {
    urlSources: {
      '__LOVABLE.supabaseUrl': !!g.__LOVABLE?.supabaseUrl,
      '__LOVABLE_SUPABASE_URL': !!g.__LOVABLE_SUPABASE_URL,
      'LOVABLE_SUPABASE_URL': !!g.LOVABLE_SUPABASE_URL,
      'SUPABASE_URL': !!g.SUPABASE_URL,
      '__ENV.SUPABASE_URL': !!g.__ENV?.SUPABASE_URL,
      '__env.SUPABASE_URL': !!g.__env?.SUPABASE_URL,
    },
    keySources: {
      '__LOVABLE.supabaseAnonKey': !!g.__LOVABLE?.supabaseAnonKey,
      '__LOVABLE_SUPABASE_ANON_KEY': !!g.__LOVABLE_SUPABASE_ANON_KEY,
      'LOVABLE_SUPABASE_ANON_KEY': !!g.LOVABLE_SUPABASE_ANON_KEY,
      'SUPABASE_ANON_KEY': !!g.SUPABASE_ANON_KEY,
      '__ENV.SUPABASE_ANON_KEY': !!g.__ENV?.SUPABASE_ANON_KEY,
      '__env.SUPABASE_ANON_KEY': !!g.__env?.SUPABASE_ANON_KEY,
    },
  });
}

let supabase: SupabaseClient | any;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Do not crash the whole app; export a proxy that throws when used.
  const errorMessage =
    'Supabase not configured. Connect the Lovable Supabase integration or set window.SUPABASE_URL and window.SUPABASE_ANON_KEY. See docs: https://docs.lovable.dev/integrations/supabase/';
  console.warn('[Supabase] ' + errorMessage);
  supabase = new Proxy(
    {},
    {
      get() {
        return () => {
          throw new Error(errorMessage);
        };
      },
    }
  );
}

export { supabase }
