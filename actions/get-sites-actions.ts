"use server";

import { supabaseServer } from "@/chai/supabase.server";

export async function getSites(userId: string) {
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
        subdomain
      )
    `,
    )
    .eq("user", userId)
    .is("deletedAt", null)
    .order("createdAt", { ascending: false });

  if (error) throw error;

  // Transform the data to flatten the apiKey
  return data?.map((site) => ({
    ...site,
    apiKey: site.app_api_keys?.[0]?.apiKey || null,
    app_api_keys: undefined, // Remove the nested app_api_keys
    subdomain: site.app_domains?.[0]?.subdomain || null,
    app_domains: undefined, // Remove the nested app_domains
  }));
}
