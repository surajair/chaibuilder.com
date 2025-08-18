"use server";

import { supabaseServer } from "@/chai/supabase.server";
import { Site } from "@/utils/types";
import { revalidatePath } from "next/cache";

export async function addDomain(site: Site, domain: string) {
  try {
    // Check if domain already exists
    const { data: existingDomain } = await supabaseServer
      .from("app_domains")
      .select("id")
      .eq("domain", domain)
      .single();

    if (existingDomain) {
      throw new Error(`Domain "${domain}" already exists`);
    }

    // Insert new domain into app_domains table
    const { data, error } = await supabaseServer
      .from("app_domains")
      .insert({ app: site.id, domain: domain })
      .select()
      .single();

    if (error) throw error;

    revalidatePath(`/websites/website/${site.id}/details`);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to add domain",
    };
  }
}
