(function(){
  const SUPABASE_URL = 'https://rmhsislsiwnqhaxbdsev.supabase.co.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_CnCcUkl2L_Is5CL5-L_gGA_nARsYGUs';
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
