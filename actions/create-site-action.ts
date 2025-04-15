"use server";

import { supabaseServer } from "@/chai/supabase.server";
import { getUser } from "./get-user-action";
import { Site } from "@/utils/types";
import { revalidatePath } from "next/cache";
import { encodedApiKey } from "@/utils/api-key";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

const DEFAULT_THEME = {
  fontFamily: {
    heading: "Poppins",
    body: "Roboto",
  },
  borderRadius: "30px",
  colors: {
    background: ["#FFFFFF", "#09090B"],
    foreground: ["#09090B", "#FFFFFF"],
    primary: ["#2563EB", "#3B82F6"],
    "primary-foreground": ["#FFFFFF", "#FFFFFF"],
    secondary: ["#F4F4F5", "#27272A"],
    "secondary-foreground": ["#09090B", "#FFFFFF"],
    muted: ["#F4F4F5", "#27272A"],
    "muted-foreground": ["#71717A", "#A1A1AA"],
    accent: ["#F4F4F5", "#27272A"],
    "accent-foreground": ["#09090B", "#FFFFFF"],
    destructive: ["#EF4444", "#7F1D1D"],
    "destructive-foreground": ["#FFFFFF", "#FFFFFF"],
    border: ["#E4E4E7", "#27272A"],
    input: ["#E4E4E7", "#27272A"],
    ring: ["#2563EB", "#3B82F6"],
    card: ["#FFFFFF", "#09090B"],
    "card-foreground": ["#09090B", "#FFFFFF"],
    popover: ["#FFFFFF", "#09090B"],
    "popover-foreground": ["#09090B", "#FFFFFF"],
  },
};

export async function createSite(formData: Partial<Site>) {
  try {
    const user = await getUser();

    // Create entry in apps table
    const newApp = {
      user: user.id,
      name: formData.name,
      languages: formData.languages,
      fallbackLang: formData.fallbackLang,
      theme: DEFAULT_THEME,
    };

    const { data: appData, error: appError } = await supabaseServer
      .from("apps")
      .insert(newApp)
      .select("id, user, name, languages, fallbackLang")
      .single();
    if (appError) throw appError;

    // Create entry in apps_online table
    const { error: onlineError } = await supabaseServer
      .from("apps_online")
      .insert(appData);
    if (onlineError) throw onlineError;

    // Creating and adding api key
    const apiKey = encodedApiKey(appData.id, ENCRYPTION_KEY);
    const { error: apiKeyError } = await supabaseServer
      .from("app_api_keys")
      .insert({ apiKey, app: appData.id });
    if (apiKeyError) throw onlineError;

    // Create entry in libraries table
    const { error: libraryError } = await supabaseServer
      .from("libraries")
      .insert({
        name: newApp.name,
        app: appData.id,
        type: "site",
      });
    if (libraryError) throw libraryError;

    revalidatePath("/sites");
    return { success: true, data: appData };
  } catch (error: any) {
    return { success: false, error: error?.message || "An error occurred" };
  }
}
