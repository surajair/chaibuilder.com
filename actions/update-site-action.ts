"use server";

import { supabaseServer } from "@/chai/supabase.server";
import { revalidatePath } from "next/cache";

export async function updateSite(
  siteId: string,
  updates: {
    name?: string;
    description?: string;
    settings?: Record<string, any>;
  }
) {
  try {
    const { data, error } = await supabaseServer
      .from("apps")
      .update(updates)
      .eq("id", siteId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/sites");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update site" };
  }
}
