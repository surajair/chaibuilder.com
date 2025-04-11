"use server";

import { supabaseServer } from "@/chai/supabase.server";
import { getSession } from "./get-user-action";
import { revalidatePath } from "next/cache";

export async function deleteSite(siteId: string) {
  // Get current user's session
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: User not authenticated");
  }

  // If authorized, proceed with deletion
  const { error } = await supabaseServer
    .from("apps")
    .delete()
    .eq("id", siteId)
    .eq("user", session?.user?.id);

  if (error) throw error;

  revalidatePath("/sites");
  return true;
}
