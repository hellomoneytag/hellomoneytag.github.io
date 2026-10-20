(() => {
const categories = [
 ["Graphics Design","✳"],["Microsoft Office / Excel","▦"],["Data Entry","⌨"],["Digital Marketing","◉"],["Translator","文"],["Event Management","✦"],["AI","✧"],["Coding","</>"],["Web Development","⌘"],["Personal Blog","▤"],["স্বশরীরে কাজ","⌖"]
];
const $ = id => document.getElementById(id);
const cfg = window.MONEYTAG_CONFIG || {};
let supabase = null, currentUser = null, currentProfile = null, authMode = "login", allJobs = [];
const isConfigured = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_URL.includes("YOUR-PROJECT") && !cfg.SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");
const slug = s => s.toLowerCase().replaceAll(" ","-");
function notify(msg){ const t=$("toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),3200); }
function showModal(id){ $(id).classList.remove("hidden"); document.body.classList.add("modal-open"); }
function hideModal(id){ $(id).classList.add("hidden"); if(document.querySelectorAll(".modal-backdrop:not(.hidden)").length===0) document.body.classList.remove("modal-open"); }
function setAuthMode(mode){ authMode=mode; const signup=mode==="signup"; $("authTitle").textContent=signup?"অ্যাকাউন্ট তৈরি করুন":"স্বাগতম"; $("authSubtitle").textContent=signup?"আপনার তথ্য দিয়ে MoneyTag-এ যোগ দিন।":"আপনার অ্যাকাউন্টে প্রবেশ করুন।"; $("nameField").classList.toggle("hidden",!signup); $("roleField").classList.toggle("hidden",!signup); $("loginTab").classList.toggle("active",!signup); $("signupTab").classList.toggle("active",signup); $("authSubmit").textContent=signup?"অ্যাকাউন্ট তৈরি করুন":"লগইন করুন"; $("authMessage").textContent=""; $("authPassword").autocomplete=signup?"new-password":"current-password"; }
function setStatus(message, kind="info"){const b=$("statusBanner");b.textContent=message;b.className="status-banner "+kind;}
function escapeHtml(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function money(n){return new Intl.NumberFormat("bn-BD",{style:"currency",currency:"BDT",maximumFractionDigits:0}).format(Number(n)||0);}
function renderCategories(){
 $("categories").innerHTML=categories.map(([name,icon])=>`<button class="category-card" data-category="${escapeHtml(name)}"><span class="category-icon">${icon}</span><span>${escapeHtml(name)}</span><span class="category-arrow">↗</span></button>`).join("");
 const opts=categories.map(([name])=>`<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
 $("categoryFilter").insertAdjacentHTML("beforeend",opts); $("jobCategory").innerHTML=opts;
}
function renderJobs(){
 const term=$("jobSearch").value.trim().toLowerCase(), cat=$("categoryFilter").value;
 const jobs=allJobs.filter(j=>(!term||(j.title+" "+j.description+" "+j.category).toLowerCase().includes(term))&&(!cat||j.category===cat));
 if(!jobs.length){$("jobsGrid").innerHTML=`<div class="empty-state"><div class="empty-icon">⌕</div><h3>${allJobs.length?"মিল পাওয়া যায়নি":"এখনো কোনো কাজ প্রকাশিত হয়নি"}</h3><p>${allJobs.length?"অন্য শব্দ বা ক্যাটাগরি দিয়ে খুঁজুন।":"ক্লায়েন্ট অ্যাকাউন্ট থেকে প্রথম কাজটি পোস্ট করুন।"}</p><button class="btn btn-outline" id="emptyPost">কাজ পোস্ট করুন</button></div>`; $("emptyPost")?.addEventListener("click",openJobModal); return;}
 $("jobsGrid").innerHTML=jobs.map(j=>`<article class="job-card"><div class="job-card-top"><span class="job-category">${escapeHtml(j.category||"অন্যান্য")}</span><span class="job-dot">●</span></div><h3>${escapeHtml(j.title)}</h3><p class="job-description">${escapeHtml(j.description)}</p><div class="job-meta"><span>◷ ${j.created_at?new Date(j.created_at).toLocaleDateString("bn-BD"):"নতুন"}</span><strong>${money(j.budget)}</strong></div><div class="job-card-bottom"><span class="client-label">ক্লায়েন্ট পোস্ট</span><button class="btn btn-small btn-outline apply-btn" data-job="${escapeHtml(j.id)}">আবেদন করুন ↗</button></div></article>`).join("");
 document.querySelectorAll(".apply-btn").forEach(b=>b.addEventListener("click",()=>applyJob(b.dataset.job)));
}
async function loadJobs(){
 if(!supabase){allJobs=[];renderJobs();return;}
 const {data,error}=await supabase.from("jobs").select("id,title,description,category,budget,created_at,status").eq("status","open").order("created_at",{ascending:false}).limit(30);
 if(error){setStatus("কাজ লোড করা যায়নি। Supabase SQL schema ও RLS সেটআপ পরীক্ষা করুন।","error");console.error(error);return;}
 allJobs=data||[];renderJobs();setStatus(`${allJobs.length.toLocaleString("bn-BD")}টি প্রকাশিত কাজ দেখানো হচ্ছে।`,"success");
}
async function loadProfile(user){
 currentUser=user; currentProfile=null;
 if(user&&supabase){const {data,error}=await supabase.from("profiles").select("*").eq("id",user.id).maybeSingle();if(!error)currentProfile=data;}
 const logged=!!user;$("loginOpen").classList.toggle("hidden",logged);$("signupOpen").classList.toggle("hidden",logged);$("logoutBtn").classList.toggle("hidden",!logged);
}
function openJobModal(){if(!currentUser){setAuthMode("login");showModal("authModal");$("authMessage").textContent="কাজ পোস্ট করতে আগে লগইন করুন।";return;}if(currentProfile?.role!=="client"){notify("কাজ পোস্ট করতে ক্লায়েন্ট অ্যাকাউন্ট প্রয়োজন।");return;}showModal("jobModal");}
async function applyJob(jobId){
 if(!currentUser){setAuthMode("login");showModal("authModal");$("authMessage").textContent="আবেদন করতে আগে লগইন করুন।";return;}
 if(currentProfile?.role!=="freelancer"){notify("কাজে আবেদন করতে ফ্রিল্যান্সার অ্যাকাউন্ট প্রয়োজন।");return;}
 const cover=prompt("এই কাজের জন্য সংক্ষিপ্ত প্রস্তাব লিখুন:");
 if(!cover||cover.trim().length<10){notify("কমপক্ষে ১০ অক্ষরের প্রস্তাব লিখুন।");return;}
 const {error}=await supabase.from("applications").insert({job_id:jobId,freelancer_id:currentUser.id,cover_letter:cover.trim()});
 if(error){notify(error.code==="23505"?"আপনি ইতিমধ্যে আবেদন করেছেন।":"আবেদন জমা হয়নি: "+error.message);return;}
 notify("আপনার আবেদন জমা হয়েছে।");
}
async function submitAuth(e){
 e.preventDefault();$("authMessage").textContent="";
 if(!supabase){$("authMessage").textContent="Supabase সেটআপ করা হয়নি। config.js-এ Project URL ও anon key বসান।";return;}
 const email=$("authEmail").value.trim(),password=$("authPassword").value;
 let result;
 if(authMode==="signup"){
   const full_name=$("fullName").value.trim(),role=$("accountRole").value;
   if(!full_name){$("authMessage").textContent="আপনার নাম লিখুন।";return;}
   result=await supabase.auth.signUp({email,password,options:{data:{full_name,role}}});
   if(!result.error&&result.data.user){const {error:profileError}=await supabase.from("profiles").upsert({id:result.data.user.id,full_name,role});if(profileError)console.warn("Profile will be created by database trigger if configured.",profileError);}
   if(!result.error){$("authMessage").textContent=result.data.session?"অ্যাকাউন্ট তৈরি হয়েছে।":"ইমেইল যাচাইয়ের লিংক পাঠানো হয়েছে—ইমেইল চেক করুন।";if(result.data.session){await loadProfile(result.data.user);hideModal("authModal");notify("MoneyTag-এ স্বাগতম!");}}
 }else{
   result=await supabase.auth.signInWithPassword({email,password});
   if(!result.error){await loadProfile(result.data.user);hideModal("authModal");notify("লগইন সফল হয়েছে।");}
 }
 if(result.error)$("authMessage").textContent=result.error.message;
}
async function submitJob(e){
 e.preventDefault();$("jobMessage").textContent="";
 if(!currentUser||currentProfile?.role!=="client"){$("jobMessage").textContent="ক্লায়েন্ট অ্যাকাউন্টে লগইন করুন।";return;}
 const job={client_id:currentUser.id,title:$("jobTitle").value.trim(),description:$("jobDescription").value.trim(),category:$("jobCategory").value,budget:Number($("jobBudget").value),status:"open"};
 const {error}=await supabase.from("jobs").insert(job);
 if(error){$("jobMessage").textContent="কাজ প্রকাশ হয়নি: "+error.message;return;}
 hideModal("jobModal");$("jobForm").reset();await loadJobs();notify("কাজ সফলভাবে প্রকাশ হয়েছে।");
}
function init(){
 $("year").textContent=new Date().getFullYear();renderCategories();
 $("loginOpen").onclick=()=>{setAuthMode("login");showModal("authModal");};$("signupOpen").onclick=$("signupBottom").onclick=()=>{setAuthMode("signup");showModal("authModal");};
 $("loginTab").onclick=()=>setAuthMode("login");$("signupTab").onclick=()=>setAuthMode("signup");
 $("postJobBtn").onclick=$("postJobHero").onclick=openJobModal;
 document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>hideModal(b.dataset.close));
 document.querySelectorAll(".modal-backdrop").forEach(b=>b.addEventListener("click",e=>{if(e.target===b)hideModal(b.id);}));
 $("authForm").addEventListener("submit",submitAuth);$("jobForm").addEventListener("submit",submitJob);
 $("jobSearch").addEventListener("input",renderJobs);$("categoryFilter").addEventListener("change",renderJobs);
 $("categories").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(b){$("categoryFilter").value=b.dataset.category;$("jobs").scrollIntoView({behavior:"smooth"});renderJobs();}});
 $("logoutBtn").onclick=async()=>{await supabase?.auth.signOut();await loadProfile(null);notify("লগআউট হয়েছে।");};
 if(isConfigured&&window.supabase){supabase=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);supabase.auth.getSession().then(async({data})=>{await loadProfile(data.session?.user||null);});supabase.auth.onAuthStateChange(async(_event,session)=>{await loadProfile(session?.user||null);});loadJobs();}
 else {setStatus("সেটআপ বাকি: config.js-এ Supabase Project URL ও anon/public key যোগ করুন, তারপর supabase/schema.sql চালান।","warning");allJobs=[{id:"sample-1",title:"একটি আধুনিক লোগো ডিজাইন প্রয়োজন",description:"ব্র্যান্ডের জন্য পরিষ্কার ও আধুনিক লোগো ডিজাইন করতে হবে। এটি কেবল UI preview—বাস্তব কাজ নয়।",category:"Graphics Design",budget:2500,created_at:new Date().toISOString(),preview:true},{id:"sample-2",title:"এক্সেল ডেটা সাজানো ও রিপোর্ট",description:"স্প্রেডশিট পরিষ্কার করা, ডেটা সাজানো এবং সাধারণ রিপোর্ট তৈরি করা। এটি কেবল UI preview—বাস্তব কাজ নয়।",category:"Microsoft Office / Excel",budget:1800,created_at:new Date().toISOString(),preview:true}];renderJobs();}
}
document.addEventListener("DOMContentLoaded",init);
})();