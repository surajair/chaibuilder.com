"use server";

import { supabaseServer } from "@/chai/supabase.server";

export async function getSite(userId: string, websiteId: string) {
  const { data, error } = await supabaseServer
    .from("apps")
    .select(
      `
      id,
      name,
      createdAt,
      fallbackLang,
      languages,
      app_api_keys (
        apiKey
      ),
      app_domains (
        domain,
        subdomain,
        hosting,
        domainConfigured
      )
    `,
    )
    .eq("user", userId)
    .is("deletedAt", null)
    .eq("id", websiteId)
    .order("createdAt", { ascending: false })
    .single();

  if (error) throw error;

  // Transform the data to flatten the apiKey
  return data;
}
