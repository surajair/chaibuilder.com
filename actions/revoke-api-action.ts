"use server";

import { supabaseServer } from "@/chai/supabase.server";
import { Site } from "@/utils/types";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export async function revokeApiKey(site: Site) {
  try {
    const newApiKey = {
      userId: (site as any).user,
      siteId: site.id,
      revokeId: randomUUID(),
    };
    const { data, error } = await supabaseServer
      .from("apps")
      .update({ apiKey: JSON.stringify(newApiKey) })
      .eq("id", site.id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/sites");
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to revoke API key",
    };
  }
}
