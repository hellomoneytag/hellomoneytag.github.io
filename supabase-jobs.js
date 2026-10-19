// Example helpers for real job listing; call after Supabase config is set.
window.MoneyTagData = {
  async listOpenJobs(category) {
    if (!window.moneyTagSupabaseReady) throw new Error("Supabase config is missing.");
    let q = window.moneyTagSupabase.from("jobs")
      .select("id,title,description,category,budget_min,budget_max,currency,deadline,created_at")
      .eq("status","open").order("created_at",{ascending:false}).limit(30);
    if (category) q = q.eq("category",category);
    const {data,error}=await q;
    if(error) throw error;
    return data;
  },
  async createJob(job) {
    if (!window.moneyTagSupabaseReady) throw new Error("Supabase config is missing.");
    const {data:{user},error:authError}=await window.moneyTagSupabase.auth.getUser();
    if(authError || !user) throw new Error("কাজ পোস্ট করতে লগইন করুন।");
    const {data,error}=await window.moneyTagSupabase.from("jobs").insert({
      client_id:user.id,title:job.title,description:job.description,category:job.category,
      budget_min:job.budget_min,budget_max:job.budget_max,currency:"BDT",deadline:job.deadline||null,status:"open"
    }).select().single();
    if(error) throw error;
    return data;
  }
};
