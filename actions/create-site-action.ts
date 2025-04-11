"use server";

import { supabaseServer } from "@/chai/supabase.server";
import { randomUUID } from "crypto";
import { getUser } from "./get-user-action";
import { Site } from "@/utils/types";
import { revalidatePath } from "next/cache";

export async function createSite(formData: Partial<Site>) {
  try {
    const user = await getUser();

    const id = randomUUID();
    const revokeId = randomUUID();

    const newSite = {
      id,
      user: user.id,
      name: formData.name,
      languages: formData.languages,
      fallbackLang: formData.fallbackLang,
      apiKey: JSON.stringify({ userId: user.id, siteId: id, revokeId }),
    };

    const { data, error } = await supabaseServer.from("apps").insert(newSite);
    if (error) throw error;

    revalidatePath("/sites");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error?.message || "An error occurred" };
  }
}
