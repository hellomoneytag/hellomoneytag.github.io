# MoneyTag Glass UI + Supabase Starter (বাংলা)

এটি MoneyTag-এর একটি **Glassmorphism UI ও Supabase-সংযুক্ত করার জন্য প্রস্তুত স্টার্টার প্রজেক্ট**। Supabase সংযোগ ছাড়া এটি লাইভ ডেটা সংরক্ষণ করে না। `config.js`-এ নিজের Supabase Project URL ও anon/public key বসানো এবং SQL schema চালানো বাধ্যতামূলক। ডেমো/preview কার্ডগুলো বাস্তব কাজ নয়।

## ফাইলসমূহ
- `index.html` — ওয়েবসাইট UI
- `styles.css` — responsive ডিজাইন
- `app.js` — লগইন, রেজিস্ট্রেশন, কাজ দেখা/পোস্ট, আবেদন
- `config.js` — Supabase public configuration
- `supabase/schema.sql` — ডেটাবেজ টেবিল, trigger, Row Level Security policy
- `privacy.html` — প্রাথমিক privacy notice

## লাইভ করার ধাপ

### 1. Supabase project তৈরি
1. https://supabase.com/ এ লগইন করে New project তৈরি করুন।
2. Project Settings → API (বা Connect) থেকে Project URL এবং anon/public key কপি করুন।
3. `config.js` ফাইলে `YOUR-PROJECT` এবং `YOUR_SUPABASE_ANON_PUBLIC_KEY` বদলে নিজের মান বসান।
4. **`service_role`/secret key কখনো ব্রাউজার কোডে দেবেন না।**

### 2. ডেটাবেজ চালু
1. Supabase → SQL Editor → New query খুলুন।
2. `supabase/schema.sql` সম্পূর্ণ কপি করে Run করুন।
3. Authentication → Providers-এ Email চালু আছে নিশ্চিত করুন।
4. Authentication → URL Configuration-এ আপনার live domain যোগ করুন। উদাহরণ: `https://moneytag.shop` এবং প্রয়োজনীয় redirect URL।
5. Supabase Authentication-এর ইমেইল confirmation সেটিং নিজের প্রয়োজন অনুযায়ী ঠিক করুন।

### 3. GitHub Pages-এ প্রকাশ
1. ZIP extract করুন।
2. সব ফাইল GitHub repository-র root-এ আপলোড করুন; `index.html` root-এ থাকতে হবে।
3. Commit changes করুন।
4. Repository → Settings → Pages → Deploy from a branch নির্বাচন করে `main` এবং `/ (root)` সেট করুন।
5. `https://<username>.github.io/<repo>/` খুলে পরীক্ষা করুন।
6. Custom domain `moneytag.shop` ব্যবহার করলে GitHub Pages-এর Custom domain-এ সেট করুন এবং DNS-এ GitHub-এর নির্দেশিত records বসান। ডোমেইন provider ও DNS সেটিং অনুযায়ী সময় লাগতে পারে।

### 4. লাইভ পরীক্ষা
- নতুন client account তৈরি করে ইমেইল নিশ্চিত করুন।
- client হিসেবে লগইন করে কাজ পোস্ট করুন।
- অন্য browser/private window-তে freelancer account খুলে কাজ দেখুন ও আবেদন দিন।
- client account-এ application visibility এবং ভুল role দিয়ে job post আটকে যায় কি না পরীক্ষা করুন।
- browser console ও Supabase Logs-এ error দেখুন।

## গুরুত্বপূর্ণ সীমাবদ্ধতা
এই starter-এ authentication, profiles, job listing/posting এবং applications-এর মূল প্রবাহ রয়েছে। এটি পূর্ণাঙ্গ Upwork-সমমানের প্রোডাকশন মার্কেটপ্লেস নয়। Payment gateway/escrow, withdrawal, messaging, file upload/storage, dispute resolution, verified ID workflow, admin dashboard, notifications, rate limiting, anti-spam, legal documents এবং comprehensive security review এখনো আলাদাভাবে তৈরি/পরীক্ষা করতে হবে। অর্থ লেনদেন চালুর আগে payment provider, স্থানীয় আইন, নিরাপত্তা ও audit ব্যবস্থা যোগ করুন।

## নিরাপত্তা নোট
- Supabase anon key frontend-এ ব্যবহারযোগ্য, তবে RLS সঠিক থাকা আবশ্যক।
- কোনো secret/service role key frontend-এ রাখবেন না।
- Public profiles টেবিলে সংবেদনশীল ব্যক্তিগত তথ্য রাখবেন না; এই starter-এ `full_name`, `bio`, `skills` ইত্যাদি সাধারণ প্রোফাইল ফিল্ড।
- SQL policy production-এ ব্যবহার করার আগে নিজের business rules অনুযায়ী review করুন।
- Connects এখানে প্রাথমিক balance হিসেবে 100; connect কাটা/পেমেন্ট করার পূর্ণ transaction logic এখনও নেই।


## এই ZIP-এ এখন যা আছে
- Glassmorphism / frosted-glass UI layer
- আপলোড করা MoneyTag logo (`moneytag-logo.png`)
- Frontend: responsive HTML/CSS/JavaScript
- Supabase Auth integration (email/password)
- PostgreSQL schema, profile creation trigger, basic RLS policies
- Client job posting, freelancer application, public job list
- Privacy notice template and deployment checklist

## লাইভ-প্রোডাকশন করার আগে অবশ্যই
এই ZIP-এ তোমার ব্যক্তিগত Supabase credentials, domain DNS access, GitHub credentials বা payment-provider credentials নেই; সেগুলো ছাড়া আমি তোমার ডোমেইনে নিজে থেকে deploy করতে বা production service activate করতে পারি না। `config.js` কনফিগার, SQL চালানো এবং GitHub Pages/custom-domain deploy সম্পন্ন না হওয়া পর্যন্ত সাইটটি লাইভ নয়। পেমেন্ট/withdrawal, messaging, file storage, admin controls, identity verification, dispute workflow, notifications এবং full security review এই starter-এ সম্পূর্ণ করা হয়নি। অর্থ লেনদেনের আগে সেগুলো আলাদাভাবে তৈরি ও পরীক্ষা করতে হবে।
