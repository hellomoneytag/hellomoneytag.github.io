/* Supabase client for the static GitHub Pages frontend. */
(function () {
  const cfg = window.MONEYTAG_SUPABASE_CONFIG || {};
  const ready = window.supabase && cfg.URL && cfg.PUBLISHABLE_KEY &&
    !cfg.URL.includes("PASTE_") && !cfg.PUBLISHABLE_KEY.includes("PASTE_");
  window.moneyTagSupabaseReady = Boolean(ready);
  window.moneyTagSupabase = ready
    ? window.supabase.createClient(cfg.URL, cfg.PUBLISHABLE_KEY)
    : null;
})();
