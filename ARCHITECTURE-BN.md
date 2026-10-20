# MoneyTag — Architecture & Launch Notes

## বর্তমান আর্কিটেকচার
- Frontend: static HTML, CSS, JavaScript
- Auth + database: Supabase Auth + PostgreSQL
- Authorization: PostgreSQL Row Level Security (RLS)
- Hosting target: GitHub Pages / static hosting
- Branding: moneytag-logo.png

## Launch checklist
1. Supabase project তৈরি করুন এবং `config.js`-এ Project URL ও anon/public key বসান।
2. Supabase SQL Editor-এ `supabase/schema.sql` চালান।
3. Authentication provider ও Site URL/Redirect URLs কনফিগার করুন।
4. GitHub repository root-এ ফাইল আপলোড করে Pages deploy করুন।
5. Custom domain হলে DNS provider-এ GitHub Pages-এর দেখানো records বসান।
6. client ও freelancer—দুই role দিয়ে আলাদা browser session-এ end-to-end পরীক্ষা করুন।
7. SQL/RLS policy review এবং privacy policy সম্পূর্ণ করুন।

## নিরাপত্তা
- Browser-এ শুধুমাত্র Supabase anon/public key ব্যবহার করুন।
- `service_role`, secret API key বা database password কখনো frontend-এ রাখবেন না।
- Payment gateway ও withdrawal যোগ করার আগে server-side validation, webhook verification, ledger, idempotency, audit logs ও dispute workflow দরকার।
