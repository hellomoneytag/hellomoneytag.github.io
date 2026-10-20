/* MoneyTag Supabase client configuration.
   Replace both placeholders with your project's Project URL and publishable (or legacy anon) key.
   NEVER put a service_role/secret key in a browser file. */
(function(){
  const SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY';
  const looksConfigured = /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(SUPABASE_URL) &&
    !SUPABASE_URL.includes('YOUR-PROJECT') && !SUPABASE_PUBLISHABLE_KEY.includes('YOUR_');
  if (looksConfigured && window.supabase?.createClient) {
    window.mtSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
  } else {
    window.mtSupabase = null;
    console.warn('MoneyTag: edit supabase-config.js before using real accounts.');
  }
})();
