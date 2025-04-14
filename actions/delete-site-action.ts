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

  // Delete from libraries table first (due to foreign key constraints)
  const { error: libraryError } = await supabaseServer
    .from("libraries")
    .delete()
    .eq("app", siteId);
  if (libraryError) throw libraryError;

  // Delete from app_api_keys table
  const { error: apiKeyError } = await supabaseServer
    .from("app_api_keys")
    .delete()
    .eq("app", siteId);
  if (apiKeyError) throw apiKeyError;

  // Delete from apps_online table
  const { error: onlineError } = await supabaseServer
    .from("apps_online")
    .delete()
    .eq("id", siteId)
    .eq("user", session?.user?.id);
  if (onlineError) throw onlineError;

  // Finally delete from apps table
  const { error } = await supabaseServer
    .from("apps")
    .delete()
    .eq("id", siteId)
    .eq("user", session?.user?.id);

  if (error) throw error;

  revalidatePath("/sites");
  return true;
}
