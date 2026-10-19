const categories=[
 {name:"Graphics Design",icon:"✳",desc:"Logo, brand ও visual design"},
 {name:"Web Development",icon:"⌘",desc:"Website ও web application"},
 {name:"Data Entry",icon:"▤",desc:"তথ্য সাজানো ও data processing"},
 {name:"Digital Marketing",icon:"↗",desc:"Marketing ও social media"},
 {name:"Microsoft Excel",icon:"▦",desc:"Spreadsheet ও reporting"},
 {name:"Translation",icon:"文",desc:"ভাষা ও অনুবাদ"},
 {name:"AI Services",icon:"✧",desc:"AI workflow ও automation"},
 {name:"Event Management",icon:"◈",desc:"পরিকল্পনা ও event support"},
 {name:"Coding",icon:"</>",desc:"Software ও programming"},
 {name:"Personal Blog",icon:"✎",desc:"লেখা ও content creation"},
 {name:"In-person Work",icon:"⌖",desc:"স্থানীয় ও সরাসরি কাজ"},
 {name:"Other Services",icon:"＋",desc:"আরও দক্ষতা ও সেবা"}
];
const jobs=[
 {title:"একটি আধুনিক ব্যবসায়িক লোগো ডিজাইন",cat:"Graphics Design",budget:"৳ ৩,০০০–৫,০০০",type:"Fixed price",desc:"পরিষ্কার, স্মরণযোগ্য ব্র্যান্ড পরিচয়ের জন্য লোগো ও কয়েকটি concept প্রয়োজন।"},
 {title:"ছোট ব্যবসার জন্য responsive website",cat:"Web Development",budget:"৳ ১৫,০০০–২৫,০০০",type:"Fixed price",desc:"মোবাইল-ফ্রেন্ডলি landing page, যোগাযোগ ফর্ম ও সাধারণ content section।"},
 {title:"Excel ডেটা পরিষ্কার ও রিপোর্ট",cat:"Microsoft Excel",budget:"৳ ২,০০০–৪,০০০",type:"Fixed price",desc:"Spreadsheet পরিষ্কার করা, duplicate সরানো এবং summary তৈরি করা।"}
];
const $=s=>document.querySelector(s);
const categoryGrid=$("#categoryGrid"),jobGrid=$("#jobGrid"),modal=$("#modalBackdrop");
categoryGrid.innerHTML=categories.map(c=>`<button class="category-card" data-category="${c.name}"><span class="category-icon">${c.icon}</span><b>${c.name}</b><small>${c.desc}</small></button>`).join("");
function renderJobs(term=""){const list=jobs.filter(j=>(j.title+" "+j.cat+" "+j.desc).toLowerCase().includes(term.toLowerCase()));jobGrid.innerHTML=list.length?list.map(j=>`<article class="job-card"><div class="job-top"><span class="job-category">${j.cat}</span><span style="color:#7c8c82;font-size:11px">ডেমো</span></div><h3>${j.title}</h3><p>${j.desc}</p><div class="job-meta"><span>${j.type}</span><b>${j.budget}</b></div></article>`).join(""):`<p>এই শব্দের সঙ্গে মেলে এমন ডেমো কাজ নেই। অন্য শব্দ দিয়ে খুঁজুন।</p>`}
renderJobs();$("#year").textContent=new Date().getFullYear();
$("#searchForm").addEventListener("submit",e=>{e.preventDefault();renderJobs($("#searchInput").value);$("#jobBoard").scrollIntoView({behavior:"smooth"});});
categoryGrid.addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(b){$("#searchInput").value=b.dataset.category;renderJobs(b.dataset.category);$("#jobBoard").scrollIntoView({behavior:"smooth"});}});
$("#menuToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
$("#mainNav").addEventListener("click",e=>{if(e.target.closest("a"))$("#mainNav").classList.remove("open")});
let selectedRole="freelancer",modalMode="register";
function openModal(mode="register",role="freelancer"){modalMode=mode;selectedRole=role;modal.hidden=false;document.body.style.overflow="hidden";$("#modalTitle").textContent=mode==="login"?"আবার স্বাগতম":"MoneyTag-এ যোগ দিন";$("#modalIntro").textContent=mode==="login"?"আপনার অ্যাকাউন্টে প্রবেশ করুন।":"আপনার জন্য সঠিক অভিজ্ঞতা বেছে নিন।";$("#accountSubmit").textContent=mode==="login"?"ডেমো লগইন":"ডেমো অ্যাকাউন্ট তৈরি করুন";$("#formMessage").textContent="";document.querySelectorAll("[data-role-choice]").forEach(b=>b.classList.toggle("active",b.dataset.roleChoice===selectedRole));}
document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.open,b.dataset.role||"freelancer")));
document.querySelectorAll("[data-role-choice]").forEach(b=>b.addEventListener("click",()=>{selectedRole=b.dataset.roleChoice;document.querySelectorAll("[data-role-choice]").forEach(x=>x.classList.toggle("active",x===b));}));
function closeModal(){modal.hidden=true;document.body.style.overflow=""}
$("#modalClose").addEventListener("click",closeModal);modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)closeModal()});
$("#accountForm").addEventListener("submit",async e=>{e.preventDefault();const form=new FormData(e.currentTarget);const payload={name:form.get("name"),email:form.get("email"),password:form.get("password"),role:selectedRole};const api=(window.MONEYTAG_CONFIG||{}).API_BASE_URL;
if(window.moneyTagSupabaseReady && window.moneyTagSupabase){
  const sb=window.moneyTagSupabase;
  try{
    if(modalMode==="register"){
      const {data,error}=await sb.auth.signUp({email:payload.email,password:payload.password,options:{data:{full_name:payload.name,role:payload.role},emailRedirectTo:window.location.origin+window.location.pathname}});
      if(error) throw error;
      $("#formMessage").textContent=data.session?"অ্যাকাউন্ট তৈরি হয়েছে।":"রেজিস্ট্রেশন গ্রহণ করা হয়েছে। Email confirmation চালু থাকলে inbox দেখুন।";
    }else{
      const {data,error}=await sb.auth.signInWithPassword({email:payload.email,password:payload.password});
      if(error) throw error;
      $("#formMessage").textContent="লগইন সফল। MoneyTag account connected.";
    }
  }catch(err){$("#formMessage").textContent="Supabase error: "+(err.message||"অনুরোধ সম্পন্ন হয়নি")}
  return;
}
if(!api){$("#formMessage").textContent="এটি UI ডেমো। Supabase URL ও publishable key সেট করুন অথবা PHP Backend API যুক্ত করুন।";return}
try{const endpoint=modalMode==="login"?"/auth/login.php":"/auth/register.php";const res=await fetch(api.replace(/\/$/,"")+endpoint,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify(payload)});const data=await res.json();if(!res.ok)throw new Error(data.message||"অনুরোধ সম্পন্ন হয়নি");$("#formMessage").textContent=data.message||"অনুরোধ সফল হয়েছে।";}catch(err){$("#formMessage").textContent="সংযোগ হয়নি: "+err.message}});
const toast=$("#toast");let toastTimer;function showToast(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600)}
