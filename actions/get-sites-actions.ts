"use server";

import { supabaseServer } from "@/chai/supabase.server";

export async function getSites(userId: string) {
  const { data } = await supabaseServer
    .from("apps")
    .select()
    .eq("user", userId);

  return data;
}
